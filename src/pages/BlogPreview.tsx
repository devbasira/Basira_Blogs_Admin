
import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getBlog, updateBlogMetadata } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { format } from 'date-fns';

const BlogPreview = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();

  const { data: blog, isLoading, isError } = useQuery({
    queryKey: ['blog', id],
    queryFn: () => getBlog(id || ''),
  });

  const publishBlog = async () => {
    if (!id || !blog) return;
    
    try {
      const updatedBlog = await updateBlogMetadata(id, {
        ...blog,
        status: 'published',
      });
      
      if (updatedBlog) {
        toast({
          title: 'Blog published',
          description: 'Your blog post has been published successfully',
        });
        navigate('/dashboard');
      } else {
        toast({
          title: 'Error',
          description: 'Failed to publish the blog post',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Publish error:', error);
      toast({
        title: 'Error',
        description: 'An unexpected error occurred',
        variant: 'destructive',
      });
    }
  };

  if (isLoading) {
    return <div className="flex items-center justify-center h-64">Loading blog preview...</div>;
  }

  if (isError || !blog) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <p className="text-red-500 mb-4">Failed to load blog</p>
        <Button onClick={() => navigate('/dashboard')}>Back to Dashboard</Button>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'MMMM d, yyyy');
    } catch (error) {
      return 'Invalid date';
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold mb-2">Blog Preview</h1>
        <p className="text-muted-foreground">Review your blog post before publishing</p>
      </div>

      <Card className="mx-auto max-w-3xl shadow-sm">
        <CardContent className="p-6">
          <div className="space-y-6">
            <div>
              <h2 className="text-3xl font-bold">{blog.title}</h2>
              {blog.subheading && (
                <p className="text-xl text-muted-foreground mt-2">{blog.subheading}</p>
              )}
              <div className="flex flex-wrap gap-2 mt-4">
                {blog.tags.map((tag) => (
                  <Badge key={tag} variant="secondary">{tag}</Badge>
                ))}
              </div>
              <p className="text-sm text-muted-foreground mt-4">
                {formatDate(blog.created_at)}
              </p>
            </div>

            <div 
              className="prose max-w-none tiptap"
              dangerouslySetInnerHTML={{ __html: blog.body }}
            />

            <div className="border-t pt-4 mt-8">
              <h3 className="font-medium mb-2">Categories</h3>
              <div className="flex flex-wrap gap-2">
                {blog.categories.length > 0 ? (
                  blog.categories.map((category) => (
                    <Badge key={category} variant="outline">{category}</Badge>
                  ))
                ) : (
                  <span className="text-muted-foreground text-sm">No categories</span>
                )}
              </div>
            </div>

            <div>
              <h3 className="font-medium mb-2">Publishing to</h3>
              <div className="flex flex-wrap gap-2">
                {blog.published_to.length > 0 ? (
                  blog.published_to.map((site) => (
                    <Badge key={site}>{site}</Badge>
                  ))
                ) : (
                  <span className="text-muted-foreground text-sm">Not published to any site</span>
                )}
              </div>
            </div>

            <div>
              <h3 className="font-medium mb-2">Status</h3>
              <Badge variant={blog.status === 'published' ? 'default' : 'secondary'}>
                {blog.status === 'published' ? 'Published' : 'Draft'}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-between gap-3">
        <Button
          variant="outline"
          onClick={() => navigate(`/blogs/${id}/metadata`)}
        >
          Back to Metadata
        </Button>
        <div className="flex gap-3">
          <Button 
            variant="outline"
            onClick={() => navigate('/dashboard')}
          >
            Save as Draft
          </Button>
          {blog.status !== 'published' && (
            <Button onClick={publishBlog}>
              Publish
            </Button>
          )}
          {blog.status === 'published' && (
            <Button onClick={() => navigate('/dashboard')}>
              Return to Dashboard
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default BlogPreview;
