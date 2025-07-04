import { useState } from 'react';
import { Download, FileText, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { useToast } from '@/hooks/use-toast';
import { exportCurrentPage, exportAllPages } from '@/utils/pdfExport';

export const PDFExportButton = () => {
  const [isExporting, setIsExporting] = useState(false);
  const [isExportingAll, setIsExportingAll] = useState(false);
  const { toast } = useToast();

  const handleExportCurrent = async () => {
    setIsExporting(true);
    try {
      await exportCurrentPage();
      toast({
        title: 'PDF exportado com sucesso',
        description: 'A página atual foi exportada para PDF.',
      });
    } catch (error) {
      toast({
        title: 'Erro ao exportar PDF',
        description: 'Ocorreu um erro ao exportar a página atual.',
        variant: 'destructive',
      });
    } finally {
      setIsExporting(false);
    }
  };

  const handleExportAll = async () => {
    setIsExportingAll(true);
    try {
      const results = await exportAllPages();
      const successCount = results.filter(r => r.success).length;
      const totalCount = results.length;
      
      if (successCount === totalCount) {
        toast({
          title: 'Todas as páginas exportadas',
          description: `${successCount} páginas foram exportadas com sucesso.`,
        });
      } else {
        toast({
          title: 'Exportação parcial',
          description: `${successCount} de ${totalCount} páginas foram exportadas.`,
          variant: 'destructive',
        });
      }
    } catch (error) {
      toast({
        title: 'Erro na exportação',
        description: 'Ocorreu um erro ao exportar as páginas.',
        variant: 'destructive',
      });
    } finally {
      setIsExportingAll(false);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm">
          <FileText className="h-4 w-4 mr-2" />
          Exportar PDF
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuItem onClick={handleExportCurrent} disabled={isExporting}>
          {isExporting ? (
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          ) : (
            <Download className="h-4 w-4 mr-2" />
          )}
          Página Atual
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleExportAll} disabled={isExportingAll}>
          {isExportingAll ? (
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          ) : (
            <FileText className="h-4 w-4 mr-2" />
          )}
          Todas as Páginas
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};