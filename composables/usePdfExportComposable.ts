import autoTable from 'jspdf-autotable'
import Amiri from '~/public/fontsBase64/Amiri-normal'

export const usePdfExport = () => {
    const registerFont = (doc: any) => {
        doc.addFileToVFS('Amiri-normal.ttf', Amiri)
        doc.addFont('Amiri-normal.ttf', 'Amiri', 'normal')
        doc.setFont('Amiri')
    }

    const exportToPDF = async (options: {
        title: string
        headers: any[]
        store : any
        fetchAllData : boolean
        formatRow: (item: any) => any[]
    }) => {
        try {
            const { jsPDF } = await import('jspdf')
            const doc = new jsPDF({ orientation: 'landscape', unit: 'pt', format: 'a4' })
            registerFont(doc)
            let data;
            if (options.fetchAllData) {
                data = await options.store.get_all_data('?limit=9999999', false);
                data=data?.data;
            } else {
                data = options.store.data.data;
            }
            
            // Get current locale
            const nuxtApp = useNuxtApp()
            const locale = nuxtApp.$i18n?.locale || 'en'
            const isArabic = typeof locale === 'string' 
                ? locale.startsWith('ar') 
                : locale.value?.startsWith('ar')
            
            // Process headers
            let exportHeaders = options.headers
                .filter(h => h.key !== 'actions' && h.key !== 'avatar')
                .map(h => h.title)
                
            // Process rows
            let exportRows = data.map(item => options.formatRow(item))
            
            // Reverse arrays if locale is Arabic
            if (isArabic) {
                exportHeaders = [...exportHeaders].reverse()
                exportRows = exportRows.map(row => [...row].reverse())
            }

            autoTable(doc, {
                head: [exportHeaders],
                body: exportRows,
                startY: 10,
                margin: { top: 5, right: 5, bottom: 5, left: 5 },
                styles: { 
                    font: 'Amiri', 
                    halign: 'center',
                },
                headStyles: { 
                    fillColor: [41, 128, 185], 
                    textColor: 255, 
                    fontSize: 12, 
                    fontStyle:'normal',
                    halign: 'center',
                },
                bodyStyles: { fontSize: 10 },
                didParseCell: (data) => {
                    data.cell.styles.font = 'Amiri'
                    data.cell.styles.halign = 'center'
                },
                didDrawCell: (data) => {
                    if (data.section === 'head' && data.cell.text) {
                        data.cell.styles.halign = 'center'
                    }
                },
                theme: 'grid',
            })

            doc.setFontSize(16)
            doc.save(`${options.title}-${new Date().toDateString()}.pdf`)

        } catch (error) {
            console.error('Export error:', error)
            throw error
        }
    }

    return { exportToPDF }
}
