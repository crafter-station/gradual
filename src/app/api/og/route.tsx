import { ImageResponse } from 'next/og';
import type { NextRequest } from 'next/server';

export const runtime = 'edge';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const type = searchParams.get('type') || 'default';
    const id = searchParams.get('id') || '';
    const title = searchParams.get('title');
    const description = searchParams.get('description');
    const theme = searchParams.get('theme') || 'default';
    const preview = searchParams.get('preview') || '';

    // Font loading
    let geistRegular: ArrayBuffer;
    let geistBold: ArrayBuffer;

    try {
      geistRegular = await fetch(
        new URL('../../../../public/fonts/Geist-Regular.ttf', import.meta.url),
      ).then((res) => res.arrayBuffer());

      geistBold = await fetch(
        new URL('../../../../public/fonts/Geist-Bold.ttf', import.meta.url),
      ).then((res) => res.arrayBuffer());
    } catch (error) {
      console.error('Error loading fonts:', error);
      return new Response('Error generating image: font loading failed', {
        status: 500,
      });
    }

    // Default values
    const ogTitle = title || getDefaultTitle(type);
    const ogDescription = description || getDefaultDescription(type);

    // Generate the OG image
    return new ImageResponse(
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: theme === 'dark' ? '#09090b' : '#fafafa',
          fontFamily: 'Geist',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Background grid pattern */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundImage:
              theme === 'dark'
                ? 'linear-gradient(to right, rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.05) 1px, transparent 1px)'
                : 'linear-gradient(to right, rgba(0,0,0,0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(0,0,0,0.05) 1px, transparent 1px)',
            backgroundSize: '40px 40px',
          }}
        />

        {/* Gradient orbs - only shown for dark and gradient themes */}
        {theme !== 'light' && (
          <>
            <div
              style={{
                position: 'absolute',
                top: '-100px',
                right: '-100px',
                width: '500px',
                height: '500px',
                borderRadius: '100%',
                background:
                  'radial-gradient(circle at center, rgba(79, 70, 229, 0.15), transparent 70%)',
                filter: 'blur(60px)',
                opacity: 0.8,
              }}
            />
            <div
              style={{
                position: 'absolute',
                bottom: '-100px',
                left: '-100px',
                width: '500px',
                height: '500px',
                borderRadius: '100%',
                background:
                  'radial-gradient(circle at center, rgba(16, 185, 129, 0.15), transparent 70%)',
                filter: 'blur(60px)',
                opacity: 0.8,
              }}
            />
          </>
        )}

        {/* Content container */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            padding: '60px 80px',
            height: '100%',
            width: '100%',
            position: 'relative',
            zIndex: 10,
          }}
        >
          {/* Header */}
          <div>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                marginBottom: '40px',
              }}
            >
              <svg
                width="40"
                height="40"
                viewBox="0 0 32 32"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                aria-label="Gradual logo"
                role="img"
              >
                <path d="M16 2L2 10L16 18L30 10L16 2Z" fill="#4F46E5" />
                <path
                  d="M16 18V30M16 18L2 10V22L16 30M16 18L30 10V22L16 30"
                  stroke="#4F46E5"
                  strokeWidth="2"
                />
              </svg>
              <span
                style={{
                  marginLeft: '12px',
                  fontSize: '22px',
                  fontWeight: 'bold',
                  color: theme === 'dark' ? '#ffffff' : '#09090b',
                }}
              >
                Gradual
              </span>
            </div>

            {/* Title - different versions based on theme */}
            {theme === 'gradient' ? (
              <div
                style={{
                  fontSize: '60px',
                  fontWeight: 'bold',
                  lineHeight: 1.1,
                  marginBottom: '24px',
                  maxWidth: '800px',
                  background: 'linear-gradient(to right, #4F46E5, #10B981)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  color: 'transparent',
                }}
              >
                {ogTitle}
              </div>
            ) : (
              <div
                style={{
                  fontSize: '60px',
                  fontWeight: 'bold',
                  lineHeight: 1.1,
                  marginBottom: '24px',
                  maxWidth: '800px',
                  color: theme === 'dark' ? '#ffffff' : '#09090b',
                }}
              >
                {ogTitle}
              </div>
            )}

            {/* Description */}
            <div
              style={{
                fontSize: '24px',
                lineHeight: 1.4,
                color:
                  theme === 'dark'
                    ? 'rgba(255, 255, 255, 0.8)'
                    : 'rgba(9, 9, 11, 0.8)',
                maxWidth: '650px',
              }}
            >
              {ogDescription}
            </div>
          </div>

          {/* Type-specific badge */}
          {type !== 'default' && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                marginTop: '40px',
              }}
            >
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  backgroundColor:
                    theme === 'dark'
                      ? 'rgba(255, 255, 255, 0.1)'
                      : 'rgba(79, 70, 229, 0.1)',
                  borderRadius: '9999px',
                  padding: '8px 16px',
                }}
              >
                <span
                  style={{
                    fontSize: '16px',
                    fontWeight: 'bold',
                    color:
                      theme === 'dark' ? '#ffffff' : 'rgba(79, 70, 229, 1)',
                  }}
                >
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </span>
              </div>
            </div>
          )}

          {/* Footer */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginTop: '60px',
              borderTop:
                theme === 'dark'
                  ? '1px solid rgba(255, 255, 255, 0.1)'
                  : '1px solid rgba(0, 0, 0, 0.1)',
              paddingTop: '20px',
            }}
          >
            <span
              style={{
                fontSize: '16px',
                color:
                  theme === 'dark'
                    ? 'rgba(255, 255, 255, 0.6)'
                    : 'rgba(9, 9, 11, 0.6)',
              }}
            >
              gradual.com
            </span>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <div
                style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  backgroundColor: '#4F46E5',
                  marginRight: '8px',
                }}
              />
              <span
                style={{
                  fontSize: '16px',
                  fontWeight: 'bold',
                  color:
                    theme === 'dark'
                      ? 'rgba(255, 255, 255, 0.8)'
                      : 'rgba(9, 9, 11, 0.8)',
                }}
              >
                Master anything with scientific precision
              </span>
            </div>
          </div>
        </div>
      </div>,
      {
        width: 1200,
        height: 630,
        fonts: [
          {
            name: 'Geist',
            data: geistRegular,
            style: 'normal',
            weight: 400,
          },
          {
            name: 'Geist',
            data: geistBold,
            style: 'normal',
            weight: 700,
          },
        ],
      },
    );
  } catch (error) {
    console.error('Error generating OG image:', error);
    return new Response('Error generating image', { status: 500 });
  }
}

// Helper functions to get default titles and descriptions based on type
function getDefaultTitle(type: string): string {
  switch (type) {
    // Landing pages
    case 'home':
      return 'Gradual Learning Platform';
    case 'features':
      return 'Powerful Learning Features';
    case 'about':
      return 'About Gradual';
    case 'pricing':
      return 'Simple, Transparent Pricing';
    case 'roadmap':
      return 'Product Roadmap';
    case 'careers':
      return 'Join Our Team';
    case 'changelog':
      return 'Product Updates';

    // Learning content
    case 'course':
      return 'Course: Advanced Learning Techniques';
    case 'module':
      return 'Module: Spaced Repetition';
    case 'lesson':
      return 'Lesson: Active Recall';

    // User content
    case 'achievement':
      return 'Achievement Unlocked!';
    case 'profile':
      return 'Learning Profile';
    case 'progress':
      return 'Learning Progress';

    // Default
    default:
      return 'Gradual Learning Platform';
  }
}

function getDefaultDescription(type: string): string {
  switch (type) {
    // Landing pages
    case 'home':
      return 'Master anything with scientific precision';
    case 'features':
      return 'Discover the tools that make learning efficient and effective';
    case 'about':
      return 'Our mission to transform how people learn';
    case 'pricing':
      return 'Choose the plan that fits your learning goals';
    case 'roadmap':
      return "See what we're building next";
    case 'careers':
      return 'Help us build the future of learning';
    case 'changelog':
      return 'See our latest improvements and features';

    // Learning content
    case 'course':
      return 'Master the science of effective learning';
    case 'module':
      return 'Learn the optimal way to schedule your reviews';
    case 'lesson':
      return 'Techniques to strengthen memory through retrieval practice';

    // User content
    case 'achievement':
      return 'Completed 30-day learning streak';
    case 'profile':
      return 'View my learning journey and achievements';
    case 'progress':
      return '87% complete with 42 hours of focused learning';

    // Default
    default:
      return 'Master anything with scientific precision';
  }
}
