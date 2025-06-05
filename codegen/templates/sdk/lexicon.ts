{{ $LEX := .LEX }}
export const nsid: string = "{{ $LEX.id }}"
export const description: string = "{{ $LEX.description }}"

{{ range $D, $Def := $LEX.defs }}
// {{ $D }} | {{ $Def.type }}

{{ if eq $Def.type "record"}}
  {{ template "sdk/type-record.ts" (dict "LEX" $LEX "DEF" $Def "D" $D) }}
{{ else if eq $Def.type "procedure"}}
  {{ template "sdk/type-procedure.ts" (dict "LEX" $LEX "DEF" $Def "D" $D) }}
{{ end}}

{{ end }}