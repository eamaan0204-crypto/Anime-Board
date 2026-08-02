import { supabase } from '../supabaseClient'

export async function getComments(postId) {
    const { data, error } = await supabase
        .from('comments')
        .select('*')
        .eq('post_id', postId)
        .order('created_at', { ascending: true })

    if (error) throw error
    return data
}

export async function createComment(formData) {
    const { data, error } = await supabase
        .from('comments')
        .insert([formData])
        .select()
        .single()

    if (error) throw error
    return data
}

export async function deleteComment(id) {
    const { error } = await supabase
        .from('comments')
        .delete()
        .eq('id', id)

    if (error) throw error
}