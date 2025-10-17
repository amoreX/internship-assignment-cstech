import { storage } from '../storage';
import { parseCsvFile, distributeItems } from '../utils/csv-parser';

export const distributionService = {
  async handleUpload(file: any) {
    if (!file) return null;

    const { originalname, buffer } = file;
    const { rows, errors } = parseCsvFile(buffer, originalname);
    if (errors.length > 0) return { errors };
    if (rows.length === 0) return { message: 'No valid data found in CSV' };

    const agents = await storage.getAgents();
    if (agents.length === 0) return { message: 'No agents available. Please create agents before uploading.' };

    const distribution = await storage.createDistribution({ fileName: originalname, totalItems: rows.length });

    const agentIds = agents.map(a => a.id);
    const distributedItems = distributeItems(rows, agentIds);

    const allListItems: any[] = [];
    for (const [agentId, items] of Array.from(distributedItems.entries())) {
      for (const item of items) {
        allListItems.push({
          firstName: item.FirstName,
          phone: item.Phone,
          notes: item.Notes || null,
          agentId,
          distributionId: distribution.id,
        });
      }
    }

    await storage.createListItems(allListItems);

    return {
      message: 'File uploaded and distributed successfully',
      distributionId: distribution.id,
      totalItems: rows.length,
      agentsCount: agents.length,
    };
  },

  async getDistributions() {
    const distributions = await storage.getDistributions();
    const agents = await storage.getAgents();

    const detailedDistributions = await Promise.all(
      distributions.map(async (dist) => {
        const items = await storage.getListItemsByDistribution(dist.id);

        const agentMap = new Map();
        agents.forEach(agent => {
          agentMap.set(agent.id, {
            id: agent.id,
            name: agent.name,
            email: agent.email,
            itemCount: 0,
            items: [],
          });
        });

        items.forEach(item => {
          if (item.agentId && agentMap.has(item.agentId)) {
            const agentData = agentMap.get(item.agentId);
            agentData.items.push({
              id: item.id,
              firstName: item.firstName,
              phone: item.phone,
              notes: item.notes || '',
            });
            agentData.itemCount++;
          }
        });

        return {
          ...dist,
          agents: Array.from(agentMap.values()),
        };
      })
    );

    detailedDistributions.sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    return detailedDistributions;
  },
};
