import { supabase } from '../supabaseClient'

export async function uploadImage(file) {
    const fileExt = file.name.split('.').pop()
    const fileName = `${crypto.randomUUID()}.${fileExt}`

    const { error } = await supabase.storage
        .from('post-images')
        .upload(fileName, file)

    if (error) throw error

    const { data } = supabase.storage
        .from('post-images')
        .getPublicUrl(fileName)

    return data.publicUrl
}