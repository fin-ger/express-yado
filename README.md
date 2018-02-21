# YADO express backend

Yet another door opener

---

The backend accepts JSON post request under `/api/`. The following json format is expected:

```json
{
  "name": "string",
  "description": "string",
  "type": "door|text",
  "data": {},
  "ticket": "string [auth-ticket]"
}
```

The data object is specific for a type.

| Type | `data`                 |
|------|------------------------|
| door | `"open"` or `"closed"` |
| text | `string`               |
