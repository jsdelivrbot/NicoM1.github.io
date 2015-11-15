#define web

#ifdef GL_ES
precision mediump float;
#endif

varying vec2 tcoord;

uniform sampler2D tex0;
uniform float time;
uniform vec2 res;
uniform vec2 player;
uniform float effectMult;

void main() {
	vec2 uv = tcoord;
	vec2 dist = abs(vec2(gl_FragCoord.x, gl_FragCoord.y) - (res/vec2(2.0,2.0)));
	dist = (res/vec2(2.0,2.0)) - dist;
	dist /= vec2(res.x/9.0,res.y/6.0);

	float xmult = 1.0;
	float ymult = 1.0;

	if(mod(gl_FragCoord.x - 0.5, 3.0) == 0.0) {
		xmult = -1.0;
	}
	if(mod(gl_FragCoord.y - 0.5, 3.0) == 0.0) {
		ymult = -1.0;
	}

	xmult *= effectMult;
	ymult *= effectMult;

	xmult = clamp(xmult, -1.0, 1.0);
	ymult = clamp(ymult, -1.0, 1.0);

	uv.x += (sin(time + uv.x) * 0.01 * dist.x) * xmult;
	uv.y += (cos(time + uv.y) * 0.01 * dist.y) * ymult;

	vec4 final = texture2D(tex0, uv);

	//if(uv.x != tcoord.x) {
		//final.r *= 4.0;
	//}

    gl_FragColor = final;
}

/*varying vec2 tcoord;

uniform sampler2D tex0;
uniform float time;
uniform vec2 resolution;

void main() {
    vec2 uv = tcoord;
    vec4 col = texture2D(tex0, vec2( sin(uv.x /0.4 + sin(800.0) ),sin(uv.y *2000.0) ));
    uv -= col.r;
    uv += col.g;
    uv -= col.b;
    gl_FragColor = texture2D(tex0, uv);
}*/
