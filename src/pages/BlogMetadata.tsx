
import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getBlog, updateBlogMetadata } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { X } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import { BlogMetadataFormData, BlogSite, BlogStatus } from '@/types';

const siteOptions: { value: BlogSite; label: string }[] = [
  { value: 'basira', label: 'Basira' },
  { value: 'sustenance', label: 'Sustenance' },
  { value: 'minimal-muslim', label: 'Minimal Muslim' },
];

const BlogMetadata = () => {
  const { id } = useParams<{ id: string }>();
  const [formData, setFormData] = useState<BlogMetadataFormData>({
    tags: [],
    categories: [],
    published_to: [],
    status: 'draft',
  });
  const [tagInput, setTagInput] = useState('');
  const [categoryInput, setCategoryInput] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const { data: blog, isLoading, isError } = useQuery({
    queryKey: ['blog', id],
    queryFn: () => getBlog(id || ''),
    onSuccess: (data) => {
      if (data) {
        setFormData({
          tags: data.tags || [],
          categories: data.categories || [],
          published_to: data.published_to || [],
          status: data.status || 'draft',
        });
      }
    },
  });

  const addTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData((prev) => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()],
      }));
      setTagInput('');
    }
  };

  const removeTag = (tag: string) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((t) => t !== tag),
    }));
  };

  const addCategory = () => {
    if (categoryInput.trim() && !formData.categories.includes(categoryInput.trim())) {
      setFormData((prev) => ({
        ...prev,
        categories: [...prev.categories, categoryInput.trim()],
      }));
      setCategoryInput('');
    }
  };

  const removeCategory = (category: string) => {
    setFormData((prev) => ({
      ...prev,
      categories: prev.categories.filter((c) => c !== category),
    }));
  };

  const toggleSite = (site: BlogSite) => {
    setFormData((prev) => {
      if (prev.published_to.includes(site)) {
        return {
          ...prev,
          published_to: prev.published_to.filter((s) => s !== site),
        };
      } else {
        return {
          ...prev,
          published_to: [...prev.published_to, site],
        };
      }
    });
  };

  const setStatus = (status: BlogStatus) => {
    setFormData((prev) => ({
      ...prev,
      status,
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

    try {
      setIsSubmitting(true);
      const updatedBlog = await updateBlogMetadata(id, formData);
      
      if (updatedBlog) {
        toast({
          title: 'Metadata updated',
          description: 'Your blog metadata has been updated successfully',
        });
        navigate(`/blogs/${id}/preview`);
      } else {
        toast({
          title: 'Error',
          description: 'Failed to update the blog metadata',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Update metadata error:', error);
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
        <h1 className="text-2xl font-bold mb-2">Blog Metadata</h1>
        <p className="text-muted-foreground">Step 2: Configure your blog settings</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4">
          <div>
            <Label htmlFor="tags">Tags</Label>
            <div className="flex gap-2 mt-1">
              <Input
                id="tags"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                placeholder="Add a tag"
                className="flex-1"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    addTag();
                  }
                }}
              />
              <Button type="button" onClick={addTag}>
                Add
              </Button>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {formData.tags.map((tag) => (
                <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                  {tag}
                  <button
                    type="button"
                    onClick={() => removeTag(tag)}
                    className="hover:bg-accent rounded-full p-0.5"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
          </div>

          <div>
            <Label htmlFor="categories">Categories</Label>
            <div className="flex gap-2 mt-1">
              <Input
                id="categories"
                value={categoryInput}
                onChange={(e) => setCategoryInput(e.target.value)}
                placeholder="Add a category"
                className="flex-1"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    addCategory();
                  }
                }}
              />
              <Button type="button" onClick={addCategory}>
                Add
              </Button>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {formData.categories.map((category) => (
                <Badge key={category} variant="secondary" className="flex items-center gap-1">
                  {category}
                  <button
                    type="button"
                    onClick={() => removeCategory(category)}
                    className="hover:bg-accent rounded-full p-0.5"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
          </div>

          <div>
            <Label>Publish to Web Apps</Label>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 mt-2">
              {siteOptions.map((site) => (
                <div key={site.value} className="flex items-center space-x-2">
                  <Checkbox
                    id={`site-${site.value}`}
                    checked={formData.published_to.includes(site.value)}
                    onCheckedChange={() => toggleSite(site.value)}
                  />
                  <Label 
                    htmlFor={`site-${site.value}`}
                    className="cursor-pointer"
                  >
                    {site.label}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          <div>
            <Label htmlFor="status">Status</Label>
            <Select
              value={formData.status}
              onValueChange={(value: BlogStatus) => setStatus(value)}
            >
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="published">Published</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex justify-between gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate(`/blogs/${id}/edit`)}
          >
            Back to Content
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Saving...' : 'Save & Preview'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default BlogMetadata;
