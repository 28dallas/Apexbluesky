export interface ToolFaq {
    q: string;
    a: string;
}

export interface ToolSeo {
    title?: string;
    description?: string;
    howTo?: string;
    faqs?: ToolFaq[];
}

export interface ToolAffiliate {
    name: string;
    text: string;
    url: string;
    cta: string;
    logo?: string;
    features?: string[];
}

export interface ToolDefinition {
    title: string;
    description: string;
    icon: string;
    category: string;
    buttonText: string;
    action: string;
    inputPlaceholder?: string;
    seo?: ToolSeo;
    affiliate?: ToolAffiliate;
}

export type ToolCatalog = Record<string, ToolDefinition>;

export interface ToolWithId extends ToolDefinition {
    id: string;
}
