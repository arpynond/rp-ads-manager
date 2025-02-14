"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"

export default function DocumentationPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Documentation</h1>
      <Tabs defaultValue="getting-started" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="getting-started">Getting Started</TabsTrigger>
          <TabsTrigger value="key-concepts">Key Concepts</TabsTrigger>
        </TabsList>
        <TabsContent value="getting-started">
          <Card>
            <CardHeader>
              <CardTitle>Getting Started</CardTitle>
              <CardDescription>Learn how to get started with our platform</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Welcome to our platform! Here's how to get started:</p>
              <ol className="list-decimal list-inside mt-4 space-y-2">
                <li>Sign up for an account</li>
                <li>Set up your first campaign</li>
                <li>Create your first ad</li>
                <li>Launch your campaign</li>
              </ol>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="key-concepts">
          <ScrollArea className="h-[calc(100vh-10rem)] pr-4">
            <div className="space-y-6">
              <p className="text-lg">
                Each Campaign can contain multiple Ads Groups, and each Ads Group can contain multiple Ads.
              </p>

              {/* Billing Card */}
              <Card>
                <CardHeader>
                  <CardTitle>Billing</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>
                      <strong>Dynamic CPM</strong>: The billing will be performed based on the advertising budget spent
                      dynamically
                    </li>
                    <li>
                      <strong>Fixed/Dynamic CPA</strong>: The billing will be performed for each action (for example:
                      purchase)
                    </li>
                  </ul>
                </CardContent>
              </Card>

              {/* Campaign Card */}
              <Card>
                <CardHeader>
                  <CardTitle>Campaign</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Goal</h3>
                    <p className="mb-4">The way you measure your campaign</p>
                    <ul className="list-disc pl-6 space-y-4">
                      <li>
                        <strong>Cost Per Action (CPA)</strong>
                        <ul className="list-disc pl-6 mt-2">
                          <li>Defined as your ad spend divided by the number of actions (E.g. purchases)</li>
                          <li>The campaign will optimize to drive maximum actions on your site</li>
                        </ul>
                      </li>
                      <li>
                        <strong>Return On Ad Spend (ROAS)</strong>
                        <ul className="list-disc pl-6 mt-2">
                          <li>Defined as your revenue generated divided by ad spend</li>
                          <li>The campaign will optimize to drive maximum return on ad spend on your site</li>
                        </ul>
                      </li>
                    </ul>
                  </div>

                  <Separator />

                  <div>
                    <h3 className="text-xl font-semibold mb-2">Bid Strategy</h3>
                    <p className="mb-4">Control how the model bids and spends your budget</p>
                    <div className="space-y-6">
                      <div>
                        <h5 className="font-medium mb-2">Maximize Results (Spend-based bidding)</h5>
                        <div className="pl-4 space-y-4">
                          <div>
                            <h6 className="font-medium mb-2">Highest Volume</h6>
                            <ul className="list-disc pl-6 space-y-2">
                              <li>
                                All campaigns begin with this bidding strategy, which uses the full budget to achieve
                                the most efficient performance outcome
                              </li>
                              <li>Maximize the total number of conversions</li>
                            </ul>
                          </div>
                          <div>
                            <h6 className="font-medium mb-2">Highest Value</h6>
                            <ul className="list-disc pl-6 space-y-2">
                              <li>
                                A bidding strategy that uses the entire budget to target actions with higher monetary
                                value
                              </li>
                              <li>Maximize the number of high-value conversions</li>
                            </ul>
                          </div>
                        </div>
                      </div>
                      <div>
                        <h5 className="font-medium mb-2">Maximize Profit (Goal-based bidding)</h5>
                        <div className="pl-4">
                          <h6 className="font-medium mb-2">Cost Per Action Goal</h6>
                          <ul className="list-disc pl-6 space-y-2">
                            <li>
                              This mode allocates budget to users it <strong>predicts</strong> will convert and deliver
                              the results that are set in Campaign Settings goal
                            </li>
                            <li>
                              It aims to maximize spending within predicted result boundaries but may not use the entire
                              budget due to factors like market conditions and conversion rates
                            </li>
                            <li>
                              While providing performance guardrails, this mode may cause spending fluctuations.{" "}
                              <strong>Adherence to the set goal is not guaranteed</strong>
                            </li>
                            <li>
                              This mode can only be used in mature campaigns (defined by the duration of the campaign
                              and the budget it spent)
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <h3 className="text-xl font-semibold mb-2">Daily Budget</h3>
                    <p>How much of the campaign budget is spent each day</p>
                  </div>

                  <Separator />

                  <div>
                    <h3 className="text-xl font-semibold mb-2">Target Event</h3>
                    <p>The specific event (action) that the campaign will use as its optimization target.</p>
                  </div>

                  <Separator />

                  <div>
                    <h3 className="text-xl font-semibold mb-2">Proxy Event</h3>
                    <p>
                      An event that has high conversion rates to the target event and must be transmitted to the system
                      via rPixel or Server-to-Server.
                    </p>
                    <p>
                      Using this event, the system learns to identify high-potential users during the early campaign
                      stages.
                    </p>
                  </div>

                  <Separator />

                  <div>
                    <h3 className="text-xl font-semibold mb-2">Fixed Target Event Value</h3>
                    <p>The fixed value or profit expected from each completed action</p>
                  </div>

                  <Separator />

                  <div>
                    <h3 className="text-xl font-semibold mb-2">Contextual Targeting</h3>
                    <p className="mb-4">
                      Uses machine learning to display your ads on web pages and apps with content closely related to
                      your products or services. The system analyzes each placement's context to determine if your ad is
                      a good match.
                    </p>
                    <ul className="list-disc pl-6 space-y-2">
                      <li>
                        <strong>Category contextual targeting</strong>: Targets based on broad categories like beauty,
                        automotive, or finance.
                      </li>
                      <li>
                        <strong>Keyword contextual targeting</strong>: Targets based on specific keywords you choose.
                      </li>
                    </ul>
                  </div>

                  <Separator />

                  <div>
                    <h3 className="text-xl font-semibold mb-2">User Segmentation</h3>
                    <p>
                      Divide your audience into specific groups based on characteristics like demographics, behavior
                      patterns, and interests. This segmentation allows for more targeted and personalized ad delivery,
                      improving campaign effectiveness. The system uses both first-party data and machine learning to
                      create and optimize these segments in real-time.
                    </p>
                  </div>

                  <Separator />

                  <div>
                    <h3 className="text-xl font-semibold mb-2">Target Audience</h3>
                    <p className="mb-4">
                      A predefined combination of contextual targeting and user segmentation that can be reused across
                      multiple campaigns
                    </p>
                    <Alert>
                      <AlertDescription>
                        Avoid using Target Audience together with User Segmentation and Contextual Targeting components
                        simultaneously.
                      </AlertDescription>
                    </Alert>
                  </div>

                  <Separator />

                  <div>
                    <h3 className="text-xl font-semibold mb-2">Filters</h3>
                    <p>
                      Specific criteria to refine your ad targeting and ensure your campaigns reach the right audience.
                      Filters can include parameters such as geography, device types, operating systems, and connection
                      types.
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Ads Group Card */}
              <Card>
                <CardHeader>
                  <CardTitle>Ads Group</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <p>
                    Ads Groups are organized according to predefined templates that specify both the ad format and
                    compatible device types. These templates ensure consistency and optimal display across different
                    platforms while simplifying the ad creation process. Each template is carefully designed to maximize
                    the effectiveness of your advertising content based on the specific requirements of different ad
                    formats and the technical specifications of various devices.
                  </p>

                  <div>
                    <h3 className="text-xl font-semibold mb-2">Ad Type</h3>
                    <ul className="list-disc pl-6 space-y-4">
                      <li>
                        <strong>Banner</strong>
                        <p className="mt-1">
                          Standard rectangular ad format displayed in designated spaces on websites and apps. Available
                          in various standardized IAB sizes to ensure compatibility across different platforms and
                          placements.
                        </p>
                      </li>
                      <li>
                        <strong>Rewarded</strong>
                        <p className="mt-1">
                          Opt-in video ads that offer users rewards like in-game currency, extra lives, or premium
                          content in exchange for watching. This format drives high engagement through a value exchange
                          model, where users actively choose to interact with the ad for a clear benefit.
                        </p>
                      </li>
                      <li>
                        <strong>Playable</strong>
                        <p className="mt-1">
                          Interactive ad format (HTML) that boosts engagement and conversion rates by allowing users to
                          interact directly with the ad itself. E.g. playable mini-games or interactive product
                          galleries.
                        </p>
                      </li>
                      <li>
                        <strong>Interstitial</strong>
                        <p className="mt-1">
                          Full-screen ads that appear during natural transition points in an app or game or website,
                          such as between levels or content sections. These ads command high user attention and
                          typically include rich media content like images or videos, with clear call-to-action buttons
                          to drive engagement.
                        </p>
                      </li>
                    </ul>
                    <Alert className="mt-4">
                      <AlertDescription>
                        Rewarded, Playable, and Interstitial formats are made up of two steps, step one the main content
                        (video, image, html) and step two the end card (image, html)
                      </AlertDescription>
                    </Alert>
                  </div>

                  <Separator />

                  <div>
                    <h3 className="text-xl font-semibold mb-2">Device Type</h3>
                    <p className="mb-4">
                      Specifies the compatible platforms and device types for ad delivery, including mobile devices
                      (phones and tablets), desktop computers. This setting ensures your ads are displayed appropriately
                      across different screen sizes, operating systems, and user interfaces
                    </p>
                    <Alert>
                      <AlertDescription>
                        Rewarded and Playable ad types are only available on phones and tablets
                      </AlertDescription>
                    </Alert>
                  </div>

                  <Separator />

                  <div>
                    <h3 className="text-xl font-semibold mb-2">Target URL</h3>
                    <p>
                      The destination URL where users will be directed after clicking on your ad. This URL should lead
                      to a relevant landing page that aligns with your campaign goals and ad content, whether it's a
                      product page, app download page, or promotional landing page.
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Ad Card */}
              <Card>
                <CardHeader>
                  <CardTitle>Ad</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p>
                    Each ads group contains multiple ads of the same type but with different content. The system
                    optimizes these ads by matching the most appropriate one to each user, placement, and frequency to
                    achieve high conversion rates.
                  </p>
                  <Alert>
                    <AlertDescription>
                      We recommend starting each ads group with at least five different ads. Ads with low conversion
                      rates will receive less exposure, so it's best to add new ones every week.
                    </AlertDescription>
                  </Alert>
                </CardContent>
              </Card>
            </div>
          </ScrollArea>
        </TabsContent>
      </Tabs>
    </div>
  )
}

