import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { FileSpreadsheet, Users, Calendar } from 'lucide-react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { format } from 'date-fns';

interface Distribution {
  id: string;
  fileName: string;
  totalItems: number;
  createdAt: string;
  agents: Array<{
    id: string;
    name: string;
    email: string;
    itemCount: number;
    items: Array<{
      id: string;
      firstName: string;
      phone: string;
      notes: string;
    }>;
  }>;
}

export function DistributionViewer() {
  const { data: distributions, isLoading } = useQuery<Distribution[]>({
    queryKey: ['/distributions'],
  });

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-32 w-full" />
      </div>
    );
  }

  if (!distributions || distributions.length === 0) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-semibold">Distributions</h2>
          <p className="text-sm text-muted-foreground mt-1">
            View all uploaded and distributed lists
          </p>
        </div>
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <FileSpreadsheet className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-lg font-medium">No distributions yet</p>
            <p className="text-sm text-muted-foreground">
              Upload a CSV file to get started
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold">Distributions</h2>
        <p className="text-sm text-muted-foreground mt-1">
          View all uploaded and distributed lists
        </p>
      </div>

      <div className="space-y-4">
        {distributions.map((distribution) => (
          <Card key={distribution.id}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <CardTitle className="text-lg">{distribution.fileName}</CardTitle>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <FileSpreadsheet className="h-4 w-4" />
                      <span>{distribution.totalItems} items</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      <span>{format(new Date(distribution.createdAt), 'MMM d, yyyy')}</span>
                    </div>
                  </div>
                </div>
                <Badge variant="secondary">
                  {distribution.agents.length} agents
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                {distribution.agents.map((agent) => (
                  <AccordionItem key={agent.id} value={agent.id}>
                    <AccordionTrigger className="hover:no-underline">
                      <div className="flex items-center justify-between w-full pr-4">
                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4 text-muted-foreground" />
                          <span className="font-medium">{agent.name}</span>
                          <span className="text-sm text-muted-foreground">
                            ({agent.email})
                          </span>
                        </div>
                        <Badge variant="outline" className="ml-2">
                          {agent.itemCount} items
                        </Badge>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-2 pt-2">
                        {agent.items.length === 0 ? (
                          <p className="text-sm text-muted-foreground text-center py-4">
                            No items assigned to this agent
                          </p>
                        ) : (
                          <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                              <thead>
                                <tr className="border-b">
                                  <th className="text-left py-2 px-4 font-medium">Name</th>
                                  <th className="text-left py-2 px-4 font-medium">Phone</th>
                                  <th className="text-left py-2 px-4 font-medium">Notes</th>
                                </tr>
                              </thead>
                              <tbody>
                                {agent.items.map((item, index) => (
                                  <tr
                                    key={item.id}
                                    className={index % 2 === 0 ? 'bg-muted/30' : ''}
                                    data-testid={`item-${item.id}`}
                                  >
                                    <td className="py-2 px-4">{item.firstName}</td>
                                    <td className="py-2 px-4 font-mono text-xs">
                                      {item.phone}
                                    </td>
                                    <td className="py-2 px-4 text-muted-foreground">
                                      {item.notes || '-'}
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        )}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
