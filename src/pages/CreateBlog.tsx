
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createBlog } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import TiptapEditor from '@/components/TiptapEditor';
import { BlogFormData } from '@/types';

const CreateBlog = () => {
  const [formData, setFormData] = useState<BlogFormData>({
    title: '',
    subheading: '',
    body: '',
    images: [],
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

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
      const blog = await createBlog(formData);
      
      if (blog) {
        toast({
          title: 'Blog created',
          description: 'Your blog post has been created successfully',
        });
        navigate(`/blogs/${blog.id}/metadata`);
      } else {
        toast({
          title: 'Error',
          description: 'Failed to create the blog post',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Create blog error:', error);
      toast({
        title: 'Error',
        description: 'An unexpected error occurred',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold mb-2">Create New Blog</h1>
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

export default CreateBlog;
