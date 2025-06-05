
export function xrpcCall(
  host: string,
  nsid: string,
  method: string,
  params?: Record<string, string>,
  payload?: Record<string, any>,
  headers: Record<string, string> = {},
): Promise<any> {

  // constuct the URL
  const urlParams = new URLSearchParams(params);
  var url = `${host}/xrpc/${nsid}`
  if (params && Object.keys(params).length > 0) {
    url += `?${urlParams.toString()}`;
  }

  // construct fetch options
  var opts: any = {
    method: method,
    headers: {
      credentials: 'include',
      'Content-Type': 'application/json',
      ...headers,
    },
  }
  if (payload) {
    opts.body = JSON.stringify(payload)
  }
  
  // make the request
  return fetch(url, opts)
    .then(response => {
      if (!response.ok) {
        throw new Error(`Error calling ${nsid}: ${response.statusText}`);
      }
      return response.json();
    });
}
