
import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getBlog, updateBlogContent } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import TiptapEditor from '@/components/TiptapEditor';
import { BlogFormData } from '@/types';

const EditBlog = () => {
  const { id } = useParams<{ id: string }>();
  const [formData, setFormData] = useState<BlogFormData>({
    title: '',
    subheading: '',
    body: '',
    images: [],
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const { data: blog, isLoading, isError } = useQuery({
    queryKey: ['blog', id],
    queryFn: () => getBlog(id || ''),
    onSuccess: (data) => {
      if (data) {
        setFormData({
          title: data.title,
          subheading: data.subheading,
          body: data.body,
          images: data.images,
        });
      }
    },
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleEditorChange = (html: string) => {
    setFormData((prev) => ({ ...prev, body: html }));
  };

  const handleImageUpload = (imageUrl: string) => {
    setFormData((prev) => ({
      ...prev,
      images: [...prev.images, imageUrl],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!id) {
      toast({
        title: 'Error',
        description: 'Invalid blog ID',
        variant: 'destructive',
      });
      return;
    }

    if (!formData.title.trim()) {
      toast({
        title: 'Error',
        description: 'Please provide a title for your blog post',
        variant: 'destructive',
      });
      return;
    }

    try {
      setIsSubmitting(true);
      const updatedBlog = await updateBlogContent(id, formData);
      
      if (updatedBlog) {
        toast({
          title: 'Blog updated',
          description: 'Your blog post has been updated successfully',
        });
        navigate(`/blogs/${id}/metadata`);
      } else {
        toast({
          title: 'Error',
          description: 'Failed to update the blog post',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Update blog error:', error);
      toast({
        title: 'Error',
        description: 'An unexpected error occurred',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return <div className="flex items-center justify-center h-64">Loading blog...</div>;
  }

  if (isError || !blog) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <p className="text-red-500 mb-4">Failed to load blog</p>
        <Button onClick={() => navigate('/dashboard')}>Back to Dashboard</Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold mb-2">Edit Blog</h1>
        <p className="text-muted-foreground">Step 1: Content Creation</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4">
          <div>
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Enter the blog title"
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="subheading">Subheading</Label>
            <Input
              id="subheading"
              name="subheading"
              value={formData.subheading}
              onChange={handleChange}
              placeholder="Enter a subheading or brief description"
              className="mt-1"
            />
          </div>

          <div>
            <Label>Content</Label>
            <div className="mt-1">
              <TiptapEditor
                content={formData.body}
                onChange={handleEditorChange}
                onImageUpload={handleImageUpload}
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate('/dashboard')}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Saving...' : 'Save & Continue'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default EditBlog;
