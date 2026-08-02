import { supabase } from '../supabaseClient'
import { POST_FIELDS } from '../constants'

export async function createPost(formData) {
    const { data, error } = await supabase
        .from('posts')
        .insert([formData])
        .select()
        .single()

    if (error) throw error
    return data
}

export async function getPosts({ sortBy = 'created_at', flag = null, search = '' } = {}) {
    let query = supabase.from('posts').select('*')

    if (flag) {
        query = query.eq('flag', flag)
    }
    if (search) {
        query = query.ilike('title', `%${search}%`)
    }

    query = query.order(sortBy, { ascending: false })

    const { data, error } = await query
    if (error) throw error
    return data
}

export async function getPost(id) {
    const { data, error } = await supabase
        .from('posts')
        .select('*')
        .eq('id', id)
        .single()

    if (error) throw error
    return data
}

export async function upvotePost(id, currentUpvotes) {
    const { data, error } = await supabase
        .from('posts')
        .update({ upvotes: currentUpvotes + 1 })
        .eq('id', id)
        .select()
        .single()

    if (error) throw error
    return data
}

export async function updatePost(id, formData) {
    const { data, error } = await supabase
        .from('posts')
        .update(formData)
        .eq('id', id)
        .select()
        .single()

    if (error) throw error
    return data
}

export async function deletePost(id) {
    const { error } = await supabase
        .from('posts')
        .delete()
        .eq('id', id)

    if (error) throw error
}