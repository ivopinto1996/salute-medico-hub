import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export interface PageExportConfig {
  name: string;
  path: string;
  title: string;
}

export const PAGES_TO_EXPORT: PageExportConfig[] = [
  { name: 'login', path: '/login', title: 'Página de Login' },
  { name: 'calendario', path: '/calendario', title: 'Calendário' },
  { name: 'documentos', path: '/documentos', title: 'Documentos' },
  { name: 'conta', path: '/conta', title: 'Gestão da Conta' },
  { name: 'gestao-perfil', path: '/gestao-perfil', title: 'Gestão do Perfil Público' },
];

export const exportPageToPDF = async (elementId: string = 'root', filename: string = 'page.pdf') => {
  try {
    const element = document.getElementById(elementId);
    if (!element) {
      throw new Error(`Element with id '${elementId}' not found`);
    }

    // Take screenshot of the element
    const canvas = await html2canvas(element, {
      scale: 2, // Higher quality
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#ffffff',
      width: element.scrollWidth,
      height: element.scrollHeight,
    });

    // Create PDF
    const imgWidth = 210; // A4 width in mm
    const pageHeight = 295; // A4 height in mm
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    let heightLeft = imgHeight;

    const pdf = new jsPDF('p', 'mm', 'a4');
    let position = 0;

    // Add first page
    pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;

    // Add additional pages if needed
    while (heightLeft >= 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }

    // Save the PDF
    pdf.save(filename);
    return true;
  } catch (error) {
    console.error('Error exporting to PDF:', error);
    throw error;
  }
};

export const exportCurrentPage = async () => {
  const currentPath = window.location.pathname;
  const currentPage = PAGES_TO_EXPORT.find(page => page.path === currentPath);
  const filename = currentPage ? `${currentPage.name}.pdf` : 'current-page.pdf';
  
  await exportPageToPDF('root', filename);
};

export const generatePagePDF = async (pageConfig: PageExportConfig) => {
  return new Promise<void>((resolve, reject) => {
    // Create a new window/iframe to render the page
    const iframe = document.createElement('iframe');
    iframe.style.position = 'absolute';
    iframe.style.top = '-9999px';
    iframe.style.width = '1200px';
    iframe.style.height = '800px';
    document.body.appendChild(iframe);

    iframe.onload = async () => {
      try {
        const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document;
        if (!iframeDoc) {
          throw new Error('Cannot access iframe document');
        }

        // Wait a bit for the page to fully render
        await new Promise(resolve => setTimeout(resolve, 2000));

        const body = iframeDoc.body;
        if (!body) {
          throw new Error('Cannot find iframe body');
        }

        // Take screenshot of the iframe content
        const canvas = await html2canvas(body, {
          scale: 1.5,
          useCORS: true,
          allowTaint: true,
          backgroundColor: '#ffffff',
        });

        // Create PDF
        const imgWidth = 210;
        const pageHeight = 295;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;
        let heightLeft = imgHeight;

        const pdf = new jsPDF('p', 'mm', 'a4');
        let position = 0;

        pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;

        while (heightLeft >= 0) {
          position = heightLeft - imgHeight;
          pdf.addPage();
          pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 0, position, imgWidth, imgHeight);
          heightLeft -= pageHeight;
        }

        pdf.save(`${pageConfig.name}.pdf`);
        
        // Clean up
        document.body.removeChild(iframe);
        resolve();
      } catch (error) {
        document.body.removeChild(iframe);
        reject(error);
      }
    };

    iframe.onerror = () => {
      document.body.removeChild(iframe);
      reject(new Error(`Failed to load page: ${pageConfig.path}`));
    };

    // Load the page
    iframe.src = window.location.origin + pageConfig.path;
  });
};

export const exportAllPages = async () => {
  const results = [];
  
  for (const pageConfig of PAGES_TO_EXPORT) {
    try {
      await generatePagePDF(pageConfig);
      results.push({ page: pageConfig.name, success: true });
    } catch (error) {
      console.error(`Failed to export ${pageConfig.name}:`, error);
      results.push({ page: pageConfig.name, success: false, error: error.message });
    }
  }
  
  return results;
};