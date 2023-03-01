import React from 'react';
import { ImageResponse } from '@vercel/og';
import Image from 'next/image';

export const config = {
  runtime: 'edge',
};

const handler = (req) => {
  try {
    const { searchParams } = new URL(req.url);

    // ?title=<title>
    const hasTitle = searchParams.has('title');
    const title = hasTitle
      ? decodeURIComponent(searchParams.get('title')?.slice(0, 100))
      : 'My default title';

    return new ImageResponse(
      (
        <div
          style={{
            backgroundColor: 'black',
            backgroundSize: '150px 150px',
            height: '100%',
            width: '100%',
            display: 'flex',
            textAlign: 'center',
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'column',
            flexWrap: 'nowrap',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              justifyItems: 'center',
            }}
          >
            <Image
              alt="Tableland"
              height={41}
              src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA4MSA0MSI+CiAgPHBhdGggZmlsbD0id2hpdGUiIGQ9Ik0xMyAxMmMyLTUgMTIgMCAxNC00IDEtMSAzLTggNi04aDMyYTIgMiAwIDAgMSAyIDJjMSAxNSAzIDI2IDE0IDM2YTIgMiAwIDAgMS0xIDNIMmEyIDIgMCAwIDEtMS0zYzgtNyAxMS0xNiAxMi0yNloiLz4KPC9zdmc+Cg=="
              style={{ margin: '0 30px' }}
              width={81}
            />
          </div>
          <div
            style={{
              fontSize: 60,
              fontStyle: 'normal',
              letterSpacing: '-0.025em',
              color: 'white',
              marginTop: 30,
              padding: '0 120px',
              lineHeight: 1.4,
              whiteSpace: 'pre-wrap',
            }}
          >
            {title}
          </div>
        </div>
      ),
      {
        width: 1920,
        height: 1080,
      },
    );
  } catch (e) {
    console.log(`${e.message}`);
    return new Response(`Failed to generate the image`, {
      status: 500,
    });
  }
}

export default handler;
