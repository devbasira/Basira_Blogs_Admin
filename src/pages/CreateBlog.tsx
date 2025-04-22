import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createBlog } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import TiptapEditor from '@/components/TiptapEditor';
import { BlogFormData } from '@/types';
import TextareaAutosize from 'react-textarea-autosize';
import { useAuth } from '@/context/AuthContext';

const CreateBlog = () => {
  const {profile, user} = useAuth();
  console.log(user)
  const [formData, setFormData] = useState<BlogFormData>({
    title: '',
    subheading: '',
    body: '',
    images: [],
    author: profile.display_name, 
    authorId : user.id
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
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
    <form onSubmit={handleSubmit}>
      <div className="w-full  flex  min-h-screen bg-white">
        <div className="max-w-[1200px]  mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-6">
            <span className="text-muted-foreground">Draft - Saved</span>
            <div className="flex gap-2">
              <Button type="button" variant="secondary">
                Preview
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Saving...' : 'Continue'}
              </Button>
            </div>
          </div>

          <TextareaAutosize
            className="w-full text-3xl sm:text-4xl font-bold outline-none placeholder-gray-600 mb-2 leading-tight"
            placeholder="Title"
            name="title"
            value={formData.title}
            onChange={handleChange}
          />

          <TextareaAutosize
            minRows={2}
            className="w-full resize-none text-lg text-gray-500 outline-none placeholder-gray-400 mb-4 leading-snug"
            placeholder="Add a subtitle..."
            name="subheading"
            value={formData.subheading}
            onChange={handleChange}
          />

          <div className="inline-flex items-center px-3 py-1 bg-muted text-sm text-gray-700 rounded-full mb-6">
            {formData.author} <span className="ml-1 text-gray-400 cursor-pointer">×</span>
          </div>
          <TiptapEditor
            content={formData.body}
            onChange={handleEditorChange}
            onImageUpload={handleImageUpload}
          />
        </div>
      </div>
    </form>
  );
};

export default CreateBlog;
