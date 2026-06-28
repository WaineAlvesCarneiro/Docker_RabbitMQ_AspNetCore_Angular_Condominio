export function formatarDataParaInput(data: Date | string | null): string | null {
   if (!data) return null;

   const d = new Date(data);
   const ano = d.getFullYear();
   const mes = ('0' + (d.getMonth() + 1)).slice(-2);
   const dia = ('0' + d.getDate()).slice(-2);
   return `${ano}-${mes}-${dia}`;
 }


 export function formatarDataParaApi(data: Date | string | null): string | null {
   if (!data) return null;

   if (typeof data === 'string') {
     if (/^\d{4}-\d{2}-\d{2}$/.test(data)) return data;

     const d = new Date(data);
     const offset = d.getTimezoneOffset();
     const localDate = new Date(d.getTime() - offset * 60000);
     return localDate.toISOString().split('T')[0];
   }

   const offset = data.getTimezoneOffset();
   const localDate = new Date(data.getTime() - offset * 60000);
   return localDate.toISOString().split('T')[0];
 }
