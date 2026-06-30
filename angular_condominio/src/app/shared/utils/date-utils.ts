export function formatarDataParaInput(data: Date | string | null): string | null {
   if (!data) return null;

   const d = new Date(data);
   const ano = d.getFullYear();
   const mes = ('0' + (d.getMonth() + 1)).slice(-2);
   const dia = ('0' + d.getDate()).slice(-2);
   return `${ano}-${mes}-${dia}`;
 }