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

A card is considered as dead when it does not send a message for 60 minutes. You must send a message containing the current state at least every 60 minutes!

## Example usage with `curl`

Type `text`:
```
$ curl -H "Content-Type: application/json" -X POST -d '{"name":"Status","type":"text","description":"Raumstatus", "data":"Zurzeit belegt", "ticket":"YnbHT57VAc7HHCmY16mo1DyHUNdbpG1p"}' https://myserver/api/
```

Type `door`:
```
$ curl -H "Content-Type: application/json" -X POST -d '{"name":"Türstatus","type":"door","description":"Türstatus von Raum 42", "data":"open", "ticket":"YnbHT57VAc7HHCmY16mo1DyHUNdbpG1p"}' https://myserver/api/
```

## Dockerfile environment variables

`TICKET` sets the ticket for any card backends. It is used as a static authentication token.

`PORT` sets the port the server runs on.
