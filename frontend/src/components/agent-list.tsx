import { useQuery } from '@tanstack/react-query';
import { Agent } from '@/schemas/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Mail, Phone, Plus, User, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { AgentForm } from './agent-form';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';
import { queryClient } from '@/lib/queryClient';
import api from '@/lib/api';

export function AgentList() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [deleteAgentId, setDeleteAgentId] = useState<string | null>(null);
  const { toast } = useToast();

  const { data: agents, isLoading } = useQuery<Agent[]>({
    queryKey: ['/agents'],
  });

  const handleDelete = async () => {
    if (!deleteAgentId) return;

    try {
      await api.delete(`/agents/${deleteAgentId}`);
      queryClient.invalidateQueries({ queryKey: ['/agents'] });
      toast({
        title: 'Agent deleted',
        description: 'The agent has been removed successfully.',
      });
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to delete agent. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setDeleteAgentId(null);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-32 w-full" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold">Agents</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Manage your team of agents
          </p>
        </div>
        <Button onClick={() => setIsFormOpen(true)} data-testid="button-add-agent">
          <Plus className="mr-2 h-4 w-4" />
          Add Agent
        </Button>
      </div>

      {agents && agents.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <User className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-lg font-medium">No agents yet</p>
            <p className="text-sm text-muted-foreground mb-4">
              Get started by adding your first agent
            </p>
            <Button onClick={() => setIsFormOpen(true)} data-testid="button-add-first-agent">
              <Plus className="mr-2 h-4 w-4" />
              Add Agent
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {agents?.map((agent) => (
            <Card key={agent.id} className="hover-elevate">
              <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
                <div className="flex-1">
                  <CardTitle className="text-lg">{agent.name}</CardTitle>
                  <Badge variant="secondary" className="mt-2">
                    Active
                  </Badge>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setDeleteAgentId(agent.id)}
                  data-testid={`button-delete-${agent.id}`}
                >
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground truncate">{agent.email}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">{agent.phone}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <AgentForm open={isFormOpen} onOpenChange={setIsFormOpen} />

      <AlertDialog open={!!deleteAgentId} onOpenChange={() => setDeleteAgentId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the agent and all their assigned lists. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel data-testid="button-cancel-delete">Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              data-testid="button-confirm-delete"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
