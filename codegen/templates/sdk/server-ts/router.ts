{{ $LEXICONS := .Lexicon }}

import { type Context, Hono } from 'hono';

const router = new Hono();

/*

{{ yaml $LEXICONS }}

*/


{{ range $LEX := $LEXICONS }}

{{ if eq $LEX.defs.main.type "query" }}
router.get('/xrpc/{{ $LEX.id }}', async (c: Context) => {
  console.log("GET /xrpc/{{ $LEX.id }}");
})
{{ end }}
{{ if eq $LEX.defs.main.type "procedure" }}
router.post('/xrpc/{{ $LEX.id }}', async (c: Context) => {
  console.log("POST /xrpc/{{ $LEX.id }}");
})
{{ end }}

{{ end }}


export default router;
