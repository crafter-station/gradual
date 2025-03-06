'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function DebugPage() {
  return (
    <div className='container mx-auto px-4 py-10'>
      <h1 className='mb-8 font-bold text-3xl'>Debug Tools</h1>

      <Tabs defaultValue="og-images">
        <TabsList className="mb-6">
          <TabsTrigger value="og-images">OG Images</TabsTrigger>
          <TabsTrigger value="components">Components</TabsTrigger>
          <TabsTrigger value="routes">Routes</TabsTrigger>
        </TabsList>

        <TabsContent value="og-images" className="space-y-8">
          <div>
            <h2 className='mb-4 font-semibold text-2xl'>Open Graph Images</h2>
            <p className='mb-6 text-muted-foreground'>
              Preview all Open Graph images used throughout the application.
            </p>

            <div className='grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3'>
              {/* Landing Pages */}
              <Card>
                <CardHeader>
                  <CardTitle>Landing Pages</CardTitle>
                  <CardDescription>
                    OG images for marketing pages
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <h3 className="font-medium">Home</h3>
                    <div className='aspect-video overflow-hidden rounded-md border bg-muted'>
                      <img
                        src="/api/og?type=home"
                        alt="Home page preview"
                        className='h-full w-full object-cover'
                      />
                    </div>
                    <div className="flex justify-end">
                      <Link href="/api/og?type=home" target="_blank">
                        <Button variant="outline" size="sm">
                          View
                        </Button>
                      </Link>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h3 className="font-medium">Features</h3>
                    <div className='aspect-video overflow-hidden rounded-md border bg-muted'>
                      <img
                        src="/api/og?type=features"
                        alt="Features page preview"
                        className='h-full w-full object-cover'
                      />
                    </div>
                    <div className="flex justify-end">
                      <Link href="/api/og?type=features" target="_blank">
                        <Button variant="outline" size="sm">
                          View
                        </Button>
                      </Link>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h3 className="font-medium">Pricing</h3>
                    <div className='aspect-video overflow-hidden rounded-md border bg-muted'>
                      <img
                        src="/api/og?type=pricing"
                        alt="Pricing page preview"
                        className='h-full w-full object-cover'
                      />
                    </div>
                    <div className="flex justify-end">
                      <Link href="/api/og?type=pricing" target="_blank">
                        <Button variant="outline" size="sm">
                          View
                        </Button>
                      </Link>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full" asChild>
                    <Link href="/api/og?type=landing&preview=all">
                      View All Landing OGs
                    </Link>
                  </Button>
                </CardFooter>
              </Card>

              {/* Learning Content */}
              <Card>
                <CardHeader>
                  <CardTitle>Learning Content</CardTitle>
                  <CardDescription>
                    OG images for courses and modules
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <h3 className="font-medium">Course</h3>
                    <div className='aspect-video overflow-hidden rounded-md border bg-muted'>
                      <img
                        src="/api/og?type=course&id=example"
                        alt="Course preview"
                        className='h-full w-full object-cover'
                      />
                    </div>
                    <div className="flex justify-end">
                      <Link
                        href="/api/og?type=course&id=example"
                        target="_blank"
                      >
                        <Button variant="outline" size="sm">
                          View
                        </Button>
                      </Link>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h3 className="font-medium">Module</h3>
                    <div className='aspect-video overflow-hidden rounded-md border bg-muted'>
                      <img
                        src="/api/og?type=module&id=example"
                        alt="Module preview"
                        className='h-full w-full object-cover'
                      />
                    </div>
                    <div className="flex justify-end">
                      <Link
                        href="/api/og?type=module&id=example"
                        target="_blank"
                      >
                        <Button variant="outline" size="sm">
                          View
                        </Button>
                      </Link>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h3 className="font-medium">Lesson</h3>
                    <div className='aspect-video overflow-hidden rounded-md border bg-muted'>
                      <img
                        src="/api/og?type=lesson&id=example"
                        alt="Lesson preview"
                        className='h-full w-full object-cover'
                      />
                    </div>
                    <div className="flex justify-end">
                      <Link
                        href="/api/og?type=lesson&id=example"
                        target="_blank"
                      >
                        <Button variant="outline" size="sm">
                          View
                        </Button>
                      </Link>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full" asChild>
                    <Link href="/api/og?type=learning&preview=all">
                      View All Learning OGs
                    </Link>
                  </Button>
                </CardFooter>
              </Card>

              {/* User Content */}
              <Card>
                <CardHeader>
                  <CardTitle>User Content</CardTitle>
                  <CardDescription>
                    OG images for user achievements and progress
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <h3 className="font-medium">Achievement</h3>
                    <div className='aspect-video overflow-hidden rounded-md border bg-muted'>
                      <img
                        src="/api/og?type=achievement&id=example"
                        alt="Achievement preview"
                        className='h-full w-full object-cover'
                      />
                    </div>
                    <div className="flex justify-end">
                      <Link
                        href="/api/og?type=achievement&id=example"
                        target="_blank"
                      >
                        <Button variant="outline" size="sm">
                          View
                        </Button>
                      </Link>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h3 className="font-medium">Profile</h3>
                    <div className='aspect-video overflow-hidden rounded-md border bg-muted'>
                      <img
                        src="/api/og?type=profile&id=example"
                        alt="Profile preview"
                        className='h-full w-full object-cover'
                      />
                    </div>
                    <div className="flex justify-end">
                      <Link
                        href="/api/og?type=profile&id=example"
                        target="_blank"
                      >
                        <Button variant="outline" size="sm">
                          View
                        </Button>
                      </Link>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h3 className="font-medium">Progress</h3>
                    <div className='aspect-video overflow-hidden rounded-md border bg-muted'>
                      <img
                        src="/api/og?type=progress&id=example"
                        alt="Progress preview"
                        className='h-full w-full object-cover'
                      />
                    </div>
                    <div className="flex justify-end">
                      <Link
                        href="/api/og?type=progress&id=example"
                        target="_blank"
                      >
                        <Button variant="outline" size="sm">
                          View
                        </Button>
                      </Link>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full" asChild>
                    <Link href="/api/og?type=user&preview=all">
                      View All User OGs
                    </Link>
                  </Button>
                </CardFooter>
              </Card>

              {/* Custom OG Generator */}
              <Card className="md:col-span-2 lg:col-span-3">
                <CardHeader>
                  <CardTitle>Custom OG Generator</CardTitle>
                  <CardDescription>
                    Generate custom OG images with specific parameters
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
                    <div className="space-y-2">
                      <label htmlFor="og-type" className='font-medium text-sm'>
                        Type
                      </label>
                      <select
                        id="og-type"
                        className="w-full rounded-md border border-input bg-background px-3 py-2"
                      >
                        <option value="custom">Custom</option>
                        <option value="course">Course</option>
                        <option value="achievement">Achievement</option>
                        <option value="profile">Profile</option>
                      </select>
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="og-title" className='font-medium text-sm'>
                        Title
                      </label>
                      <input
                        id="og-title"
                        type="text"
                        placeholder="Enter title"
                        className="w-full rounded-md border border-input bg-background px-3 py-2"
                      />
                    </div>

                    <div className="space-y-2">
                      <label
                        htmlFor="og-description"
                        className='font-medium text-sm'
                      >
                        Description
                      </label>
                      <input
                        id="og-description"
                        type="text"
                        placeholder="Enter description"
                        className="w-full rounded-md border border-input bg-background px-3 py-2"
                      />
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="og-theme" className='font-medium text-sm'>
                        Theme
                      </label>
                      <select
                        id="og-theme"
                        className="w-full rounded-md border border-input bg-background px-3 py-2"
                      >
                        <option value="default">Default</option>
                        <option value="dark">Dark</option>
                        <option value="gradient">Gradient</option>
                        <option value="minimal">Minimal</option>
                      </select>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button
                    className="w-full"
                    onClick={() => {
                      const type = (
                        document.getElementById('og-type') as HTMLSelectElement
                      )?.value;
                      const title = (
                        document.getElementById('og-title') as HTMLInputElement
                      )?.value;
                      const description = (
                        document.getElementById(
                          'og-description',
                        ) as HTMLInputElement
                      )?.value;
                      const theme = (
                        document.getElementById('og-theme') as HTMLSelectElement
                      )?.value;
                      const url = `/api/og?type=${type}&title=${title}&description=${description}&theme=${theme}`;
                      window.open(url, '_blank');
                    }}
                  >
                    Generate Custom OG
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="components">
          <div>
            <h2 className='mb-4 font-semibold text-2xl'>Component Testing</h2>
            <p className="text-muted-foreground">
              This section will be implemented in the future for component
              testing.
            </p>
          </div>
        </TabsContent>

        <TabsContent value="routes">
          <div>
            <h2 className='mb-4 font-semibold text-2xl'>Route Testing</h2>
            <p className="text-muted-foreground">
              This section will be implemented in the future for route testing.
            </p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
