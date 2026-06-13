import { createClient } from "@supabase/supabase-js";

// Use environment variables or fallback directly to user's provided Supabase credentials
const SUPABASE_URL = (import.meta as any).env?.VITE_SUPABASE_URL || "https://ymihpnzulorlrydbiqhh.supabase.co";
const SUPABASE_ANON_KEY = (import.meta as any).env?.VITE_SUPABASE_ANON_KEY || "sb_publishable_93AGr34p3LhWEIJIiNEhsg_FCInG-46";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

/**
 * Utility function to check the connection status of Supabase.
 * It queries the database and reports whether everything is set up nicely.
 */
export async function checkSupabaseConnection(): Promise<{ ok: boolean; message: string; tablesMissing?: boolean }> {
  try {
    // Quick test query to try to query from "salas"
    const { error } = await supabase.from("salas").select("id").limit(1);
    
    if (error) {
      // If code is PGRST116 or table relation does not exist, connection is valid, but database tables need to be created
      if (error.code === "PGRST116" || error.message?.includes("relation") || error.message?.includes("does not exist")) {
        return { 
          ok: true, 
          message: "Conectado ao Supabase com sucesso! Porém, as tabelas ainda não foram criadas no banco de dados. Execute o script SQL no editor do Supabase.",
          tablesMissing: true 
        };
      }
      return { ok: false, message: `Erro ao consultar banco do Supabase: ${error.message} (Código ${error.code})` };
    }
    
    return { ok: true, message: "Apenas um momento! Conectado e integrado ao Supabase com sucesso. Dados em sincronia ativa!", tablesMissing: false };
  } catch (err: any) {
    return { ok: false, message: err.message || "Erro de rede ao conectar com as credenciais do Supabase." };
  }
}
