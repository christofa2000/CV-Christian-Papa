// Este archivo de declaración describe knowledge y KnowledgeData localmente para evitar errores de importación.
// Sustituye la importación rota por una declaración interna estricta.

type KnowledgeItem = {
  title: string;
  description: string;
  icon?: string;
  url?: string;
};

export type KnowledgeData = {
  categories: Array<{
    name: string;
    items: KnowledgeItem[];
  }>;
};

declare const knowledge: KnowledgeData;
export default knowledge;
