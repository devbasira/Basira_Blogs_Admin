
import { supabaseClient } from '@/context/AuthContext';
import { Blog, BlogFormData, BlogMetadataFormData } from '@/types';

// Upload image to Supabase Storage
export const uploadImage = async (file: File): Promise<string | null> => {
  try {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
    const filePath = `blogs/${fileName}`;

    const { data, error } = await supabaseClient.storage
      .from('blog-images')
      .upload(filePath, file);

    if (error) {
      console.error('Error uploading image:', error);
      return null;
    }

    const { data: urlData } = supabaseClient.storage
      .from('blog-images')
      .getPublicUrl(filePath);

    return urlData.publicUrl;
  } catch (error) {
    console.error('Image upload error:', error);
    return null;
  }
};

// Get all blogs
export const getBlogs = async (authorId?: string): Promise<Blog[]> => {
  let query = supabaseClient
    .from('blogs')
    .select('*')
    .order('created_at', { ascending: false });

  if (authorId) {
    query = query.eq('authorId', authorId);
  }

  const { data, error } = await query;

  if (error) {
    console.error('Error fetching blogs:', error);
    return [];
  }

  return data || [];
};


export const getBlog = async (id: string): Promise<Blog | null> => {
  const { data, error } = await supabaseClient
    .from('blogs')
    .select('*')
    .eq('id', id)
    .single();
    console.log(data)
  if (error) {
    console.error('Error fetching blog:', error);
    return null;
  }

  return data;
};

// Create a new blog
export const createBlog = async (blogData: BlogFormData): Promise<Blog | null> => {
  const { data, error } = await supabaseClient
    .from('blogs')
    .insert([{
      ...blogData,
      quotes: [],
      tags: [],
      categories: [],
      published_to: [],
      status: 'draft',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }])
    .select()
    .single();

  if (error) {
    console.error('Error creating blog:', error);
    return null;
  }

  return data;
};

// Update blog content
export const updateBlogContent = async (id: string, blogData: BlogFormData): Promise<Blog | null> => {
  const { data, error } = await supabaseClient
    .from('blogs')
    .update({
      ...blogData,
      updated_at: new Date().toISOString()
    })
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error updating blog content:', error);
    return null;
  }

  return data;
};

// Update blog metadata
export const updateBlogMetadata = async (id: string, metadataData: BlogMetadataFormData): Promise<Blog | null> => {
  const { data, error } = await supabaseClient
    .from('blogs')
    .update({
      ...metadataData,
      updated_at: new Date().toISOString()
    })
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error updating blog metadata:', error);
    return null;
  }

  return data;
};

// Delete a blog
export const deleteBlog = async (id: string): Promise<boolean> => {
  const { error } = await supabaseClient
    .from('blogs')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting blog:', error);
    return false;
  }

  return true;
};
