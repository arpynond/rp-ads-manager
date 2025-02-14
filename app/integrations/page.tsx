"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Code } from "@/components/ui/code"

export default function IntegrationsPage() {
  const pixelSnippet = `<script>
var token="YOUR TOKEN";!function(e,t,n,r,i,p,a){e[r]||(e.rpx_init_url||
(e.rpx_init_url=e.location.href),(i=e[r]=function(){i.process?i.process.ap
ply(i,arguments):i.queue.push(arguments)}).queue=[],i.t=+new Date,(p
=t.createElement(n)).async=1,p.src="https://cdn.rtbrain.app/pixel/rpixe
l.min.js?t="864e5*Math.ceil(new Date/864e5,(a=t.getElementsByTag
Name(n)[0]).parentNode.insertBefore(p,a))}(window,document,"scrip
t","rpixel");rpixel("rpx_init",token);
</script>`

  const htmlExample = `<!DOCTYPE html>
<html lang="en-US">
    <head>
        <style></style>
        <script></script>
        <meta></meta>
        <link></link>
        ...
        PASTE_YOUR_RPIXEL_SNIPPET_HERE
    </head>
</html>`

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Integrations</h1>
      <Tabs defaultValue="pixel" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="pixel">Pixel</TabsTrigger>
          <TabsTrigger value="server-to-server">Server to Server</TabsTrigger>
          <TabsTrigger value="third-party">Third Party</TabsTrigger>
        </TabsList>
        <TabsContent value="pixel">
          <div className="space-y-6">
            <Card>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="text-2xl font-bold mb-4 mt-4">Step 1 - Header Implementation</h3>
                  <p className="text-lg mb-4">
                    Copy the snippet below and replace YOUR TOKEN with the token you received from Arpeely via email.
                  </p>
                  <Code>{`<!-- Start rPixel Snippet -->\n${pixelSnippet}\n<!-- End rPixel Snippet -->`}</Code>
                  <p className="text-lg mb-4">
                    To include the snippet code on every page of your website, paste it at the bottom of the header,
                    above the closing <code className="bg-muted px-1.5 py-0.5 rounded text-sm">&lt;/head&gt;</code> tag.
                  </p>
                  <Code>{htmlExample}</Code>
                  <p className="text-lg mt-4">Save and deploy.</p>
                </div>
                <div>
                  <h3 className="text-2xl font-bold mb-4">Step 2 - Sending events</h3>
                  <p className="mb-4">
                    When the snippet is embedded, a JavaScript function called{" "}
                    <code className="bg-muted px-1 py-0.5 rounded">rpixel</code> is exposed. This function is used to
                    send events to Arpeely and refine Arpeely's learning of your offer.
                  </p>
                  <p className="mb-4">
                    The <code className="bg-muted px-1 py-0.5 rounded">rpixel</code> function accepts three parameters
                    (action_type, action_name, data):
                  </p>
                  <div className="overflow-hidden rounded-lg border border-gray-200">
                    <table className="w-full">
                      <thead>
                        <tr>
                          <th className="px-4 py-3 text-left text-lg font-semibold border-b bg-gray-50">Parameter</th>
                          <th className="px-4 py-3 text-left text-lg font-semibold border-b bg-gray-50">Description</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-b">
                          <td className="px-4 py-4 align-top font-mono">action_type</td>
                          <td className="px-4 py-4">
                            <div className="font-semibold mb-2">Required.</div>
                            <div>
                              <code className="text-red-600 font-mono bg-gray-100 px-1 rounded">"event"</code> for{" "}
                              <a href="#" className="text-blue-600 hover:underline">
                                Standard Events
                              </a>{" "}
                              or <code className="text-red-600 font-mono bg-gray-100 px-1 rounded">"custom_event"</code>{" "}
                              for any additional events we have configured together
                            </div>
                          </td>
                        </tr>
                        <tr className="border-b">
                          <td className="px-4 py-4 align-top font-mono">action_name</td>
                          <td className="px-4 py-4">
                            <div className="font-semibold mb-2">Required.</div>
                            <div>
                              One of the{" "}
                              <a href="#" className="text-blue-600 hover:underline">
                                Standard Events
                              </a>{" "}
                              in case of{" "}
                              <code className="text-red-600 font-mono bg-gray-100 px-1 rounded">"event"</code>, or a
                              custom name in case of{" "}
                              <code className="text-red-600 font-mono bg-gray-100 px-1 rounded">custom_event</code>
                            </div>
                            <div className="mt-2 text-gray-500 italic">E.g. add_to_cart, purchase, quiz_done</div>
                          </td>
                        </tr>
                        <tr>
                          <td className="px-4 py-4 align-top font-mono">data</td>
                          <td className="px-4 py-4">
                            <div className="font-semibold mb-2">Optional.</div>
                            <div className="mb-2">An object (key-value) for additional data. For example:</div>
                            <ul className="space-y-4">
                              <li>
                                <code className="text-red-600 font-mono bg-gray-100 px-1 rounded">value</code> is a
                                numeric value that is associated with the action.
                                <div className="mt-1 text-gray-500">
                                  E.g., when the action is{" "}
                                  <code className="text-red-600 font-mono bg-gray-100 px-1 rounded">"purchase"</code>,
                                  the value will be price
                                </div>
                              </li>
                              <li>
                                <code className="text-red-600 font-mono bg-gray-100 px-1 rounded">product</code> is a
                                string associated with the action (Product name, Product ID, Service, etc.).
                                <div className="mt-1 text-gray-500">
                                  E.g., when the action is{" "}
                                  <code className="text-red-600 font-mono bg-gray-100 px-1 rounded">"add_to_cart"</code>
                                  , the value will be the product name
                                </div>
                              </li>
                            </ul>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  <h4 className="text-xl font-semibold mt-6 mb-4">Several examples of how to use the function</h4>
                  <div className="space-y-4">
                    <div>
                      <p className="mb-2">Without additional data - on add_to_cart. The code will look like this:</p>
                      <Code>
                        {`// Some JS code
const object = // Scroll button
const send_scroll_pixel = () => rpixel('event', 'add_to_cart');
object.addEventListener("click", send_scroll_pixel);
// Some JS code`}
                      </Code>
                    </div>
                    <div>
                      <p className="mb-2">
                        With additional data - on purchase with price. The code will look like this:
                      </p>
                      <Code>
                        {`// Some JS code
const price = 24;
const product_name = 'the_coolest_product_in_the_whole_world';
// Some JS code related to the purchase
rpixel('event', 'purchase', {
  'value': price,
  'product_name': product_name,
  'currency': 'USD'
});
// Some JS code`}
                      </Code>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        <TabsContent value="server-to-server">
          <Card>
            <CardHeader>
              <CardTitle>Server to Server Integration</CardTitle>
              <CardDescription>Manage your server-to-server integrations here.</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Server to Server integration content goes here.</p>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="third-party">
          <Card>
            <CardHeader>
              <CardTitle>Third Party Integration</CardTitle>
              <CardDescription>Manage your third-party integrations here.</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Third-party integration content goes here.</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

