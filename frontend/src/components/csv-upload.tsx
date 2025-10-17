import { useState, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Upload, FileSpreadsheet, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import { useMutation } from '@tanstack/react-query';
import { queryClient } from '@/lib/queryClient';

export function CsvUpload() {
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const uploadMutation = useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append('file', file);

      const token = localStorage.getItem('auth_token');
      const headers: Record<string, string> = {};
      
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await fetch('/api/distributions/upload', {
        method: 'POST',
        headers,
        body: formData,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Upload failed');
      }

      return response.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['/api/distributions'] });
      queryClient.invalidateQueries({ queryKey: ['/api/agents'] });
      toast({
        title: 'Upload successful',
        description: `Successfully distributed ${data.totalItems} items across ${data.agentsCount} agents.`,
      });
      setFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    },
    onError: (error: Error) => {
      toast({
        title: 'Upload failed',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  const handleFileSelect = (selectedFile: File) => {
    const validExtensions = ['.csv', '.xlsx', '.xls'];
    const fileExtension = selectedFile.name.toLowerCase().slice(selectedFile.name.lastIndexOf('.'));

    if (!validExtensions.includes(fileExtension)) {
      toast({
        title: 'Invalid file type',
        description: 'Please upload a CSV, XLSX, or XLS file.',
        variant: 'destructive',
      });
      return;
    }

    setFile(selectedFile);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      handleFileSelect(droppedFile);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      handleFileSelect(selectedFile);
    }
  };

  const handleUpload = () => {
    if (file) {
      uploadMutation.mutate(file);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold">Upload & Distribute Lists</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Upload CSV files to distribute among your agents
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>CSV Upload</CardTitle>
          <CardDescription>
            Upload a CSV file with FirstName, Phone, and Notes columns
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            className={`border-2 border-dashed rounded-md p-8 text-center transition-colors ${
              isDragging
                ? 'border-primary bg-primary/5'
                : 'border-border hover:border-primary/50'
            }`}
            data-testid="dropzone"
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".csv,.xlsx,.xls"
              onChange={handleInputChange}
              className="hidden"
              data-testid="input-file"
            />

            {file ? (
              <div className="space-y-4">
                <CheckCircle2 className="h-12 w-12 text-primary mx-auto" />
                <div>
                  <p className="font-medium">{file.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {(file.size / 1024).toFixed(2)} KB
                  </p>
                </div>
                <div className="flex gap-2 justify-center">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setFile(null);
                      if (fileInputRef.current) {
                        fileInputRef.current.value = '';
                      }
                    }}
                    data-testid="button-remove-file"
                  >
                    Remove
                  </Button>
                  <Button
                    onClick={handleUpload}
                    disabled={uploadMutation.isPending}
                    data-testid="button-upload"
                  >
                    {uploadMutation.isPending ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Uploading...
                      </>
                    ) : (
                      <>
                        <Upload className="mr-2 h-4 w-4" />
                        Upload & Distribute
                      </>
                    )}
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <FileSpreadsheet className="h-12 w-12 text-muted-foreground mx-auto" />
                <div>
                  <p className="font-medium">Drag & drop your file here</p>
                  <p className="text-sm text-muted-foreground">or</p>
                </div>
                <Button
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                  data-testid="button-browse"
                >
                  Browse Files
                </Button>
                <p className="text-xs text-muted-foreground">
                  Accepted formats: CSV, XLSX, XLS
                </p>
              </div>
            )}
          </div>

          <Card className="bg-muted/50">
            <CardContent className="pt-6">
              <div className="flex gap-2">
                <AlertCircle className="h-5 w-5 text-muted-foreground flex-shrink-0 mt-0.5" />
                <div className="space-y-2 text-sm">
                  <p className="font-medium">CSV Format Requirements:</p>
                  <ul className="list-disc list-inside text-muted-foreground space-y-1">
                    <li>Required columns: FirstName, Phone, Notes</li>
                    <li>FirstName and Phone must not be empty</li>
                    <li>Lists will be distributed equally among all agents</li>
                    <li>Remainder items distributed sequentially</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </CardContent>
      </Card>
    </div>
  );
}
