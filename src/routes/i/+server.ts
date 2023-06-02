import { hexToCSSFilter } from 'hex-to-css-filter';

import { ImageResponse } from '../../lib/og';
import type { RequestHandler } from './$types';

const textColor = '#675cee';
const templateUrl = 'https://sunny-pass.narze.live/images/sunny-template.png';
const templateBgUrl = 'https://sunny-pass.narze.live/images/sunny-template-black.png';

const thaiNumerals = ['๐', '๑', '๒', '๓', '๔', '๕', '๖', '๗', '๘', '๙'];

export const GET: RequestHandler = async ({ fetch, url }) => {
	const color = `#${url.searchParams.get('c') || 'ff7300'}`;
	const text = url.searchParams.get('t') || `${new Date().getMonth() + 1}`;

	const cssFilter = hexToCSSFilter(color);
	const transformedText = text.replace(/\d/g, (digit) => thaiNumerals[parseInt(digit)]);

	const fontFile = await fetch('/NotoSerifThai-Bold.ttf');
	const fontData: ArrayBuffer = await fontFile.arrayBuffer();

	const template = {
		html: `
      <div tw="flex relative w-full h-full bg-transparent">
        <div tw="flex absolute inset-0 bg-transparent" style="z-index: 30;">
          <img
            src="${templateBgUrl}"
            tw="absolute inset-0"
            style="z-index: 0; filter: ${cssFilter.filter};"
            alt="template"
          />

          <img
            src="${templateUrl}"
            tw="absolute inset-0"
            style="z-index: 10;"
            alt="template"
          />

          <div tw="absolute left-[50%] bottom-[13%] text-[${textColor}] font-bold"
            style="font-size: 100px; z-index: 30; transform: translateX(-50%);
            text-shadow:
            -5px 0px 0 white,
            5px 0px 0 white,
            0px -5px 0 white,
            0px 5px 0 white,
            -3.5px -3.5px 0 white,
            3.5px -3.5px 0 white,
            -3.5px 3.5px 0 white,
            3.5px 3.5px 0 white;">
            ${transformedText}
          </div>
        </div>
      </div>`
	};

	return await ImageResponse(template.html, {
		height: 1080,
		width: 1080,
		fonts: [
			{
				name: 'Noto Serif Thai',
				data: fontData,
				weight: 700
			}
		]
	});
};
