#define web

#ifdef GL_ES
precision mediump float;
#endif

varying vec2 tcoord;

uniform sampler2D tex0;
uniform vec2 texSize;
uniform vec4 outlineColor;

void main() {
	vec2 uv = tcoord;

	vec4 final = texture2D(tex0, uv);

	float texelSizeX = 1.0/texSize.x;
	float texelSizeY = 1.0/texSize.y;

	float rampSections = 5.0;

	if(final.a == 0.0 || final == vec4(91/255,70/255,81/255,1)) {
		if(texture2D(tex0, vec2(uv.x - texelSizeX, uv.y)).a > 0.0) {
			final = outlineColor;
		}
		else if(texture2D(tex0, vec2(uv.x + texelSizeX, uv.y)).a > 0.0) {
			final = outlineColor;
		}
		else if(texture2D(tex0, vec2(uv.x, uv.y - texelSizeY)).a > 0.0) {
			final = outlineColor;
		}
		/*else if(texture2D(tex0, vec2(uv.x, uv.y + texelSizeY)).a > 0.0) {
			final = outlineColor;
		}*/
	}
	final.r = round(final.r * rampSections)/(rampSections);
	final.g = round(final.g * rampSections)/rampSections;
	final.b = round(final.b * rampSections)/rampSections;

    gl_FragColor = final;
}
