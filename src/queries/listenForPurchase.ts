import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL || 'https://jopurrudzfwcwbgqjzcs.supabase.co',
  import.meta.env.VITE_SUPABASE_ANON_KEY!
)

export const listenForPurchase = (user: string, table = "pack_purchases", onMatch: (payload: any) => void) => {
  
  const channel = supabase
    .channel(`pack-purchase-${user}`)
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: table,
        filter: `user=eq.${user}`,
      },
      (payload) => {
        onMatch(payload)
        supabase.removeChannel(channel)
      }
    )
    .subscribe((status) => {
      console.log('channels tate:', status)
    })

  return channel
}