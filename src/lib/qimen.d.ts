declare module '@/lib/qimen' {
  export function calculate(date: Date, options?: {
    type?: string;
    method?: string;
    purpose?: string;
    location?: string;
  }): any;

  export function getKongWang(lunar: any, method: string): string[];
  export function getKongWangGong(kongWangZhi: string[]): string[];
  export function distributeSanQiLiuYi(juShuInfo: any): any;

  export const JIU_GONG: Record<string, {
    name: string;
    direction: string;
    element: string;
    color: string;
    yinyang: string;
  }>;

  export const JIU_XING: Record<string, {
    alias: string;
    element: string;
    color: string;
    feature: string;
  }>;

  export const BA_MEN: Record<string, {
    feature: string;
    type: string;
    element: string;
    color: string;
  }>;

  export const BA_SHEN: Record<string, {
    feature: string;
    type: string;
  }>;

  export const jiuXingModule: any;
  export const baMenModule: any;
  export const baShenModule: any;
  export const diPanModule: any;
}
