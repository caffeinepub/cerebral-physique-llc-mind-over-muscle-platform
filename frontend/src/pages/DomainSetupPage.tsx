import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { CheckCircle2, ExternalLink, Globe, Info, ArrowRight, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import CopyToClipboardControl from '@/components/CopyToClipboardControl';
import { useGetCanisterId } from '@/hooks/useQueries';
import { Skeleton } from '@/components/ui/skeleton';

export default function DomainSetupPage() {
  const { data: canisterId, isLoading, isError } = useGetCanisterId();
  
  const deployedUrl = canisterId ? `https://${canisterId}.icp0.io` : '';
  const domain = 'cerebralphysique.com';
  const wwwDomain = `www.${domain}`;
  const icTarget = 'icp1.io';

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-accent/5">
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="mb-12 text-center">
          <div className="mb-4 flex justify-center">
            <div className="rounded-full bg-neon-purple/10 p-4">
              <Globe className="h-12 w-12 text-neon-purple" />
            </div>
          </div>
          <h1 className="mb-4 text-4xl font-bold tracking-tight">
            Connect {domain} to Your Site
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
            Point your custom domain to your Internet Computer website so visitors land on your site when they visit {domain}.
          </p>
        </div>

        {/* Important Info Alert - Preview vs Deployed URLs */}
        <Alert className="mb-8 border-neon-purple/30 bg-neon-purple/5">
          <Info className="h-5 w-5 text-neon-purple" />
          <AlertTitle className="text-neon-purple">Understanding Your URLs</AlertTitle>
          <AlertDescription className="space-y-2 text-muted-foreground">
            <p>
              <strong>Preview/Draft URLs</strong> (like *.caffeine.xyz) are temporary development links. 
              They are <strong>not</strong> your deployed site and cannot be used for custom domain setup.
            </p>
            <p>
              <strong>Deployed URLs</strong> end with <code className="rounded bg-background px-1.5 py-0.5 text-sm font-mono">.icp0.io</code> and 
              represent your live site on the Internet Computer. Use the information below from your deployed site.
            </p>
          </AlertDescription>
        </Alert>

        {/* DNS Setup Requirements Alert */}
        <Alert className="mb-8 border-deep-blue/30 bg-deep-blue/5">
          <Info className="h-5 w-5 text-deep-blue" />
          <AlertTitle className="text-deep-blue">Before You Begin</AlertTitle>
          <AlertDescription className="text-muted-foreground">
            You'll need access to your domain registrar (GoDaddy or Cloudflare) and the ability to manage DNS settings. 
            DNS changes can take 24-48 hours to fully propagate worldwide.
          </AlertDescription>
        </Alert>

        {/* Your Site Information */}
        <Card className="mb-8 border-neon-purple/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-neon-purple" />
              Your Deployed Site Information
            </CardTitle>
            <CardDescription>
              You'll need these details when configuring your domain. These values are fetched from your live deployment.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {isLoading ? (
              <>
                <div className="rounded-lg bg-accent/50 p-4">
                  <p className="mb-2 text-sm font-medium text-muted-foreground">Current Site URL</p>
                  <Skeleton className="h-10 w-full" />
                </div>
                <div className="rounded-lg bg-accent/50 p-4">
                  <p className="mb-2 text-sm font-medium text-muted-foreground">Canister ID</p>
                  <Skeleton className="h-10 w-full" />
                </div>
              </>
            ) : isError ? (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error Loading Canister Information</AlertTitle>
                <AlertDescription>
                  Unable to fetch your canister ID. Please refresh the page or contact support if the issue persists.
                </AlertDescription>
              </Alert>
            ) : (
              <>
                <div className="rounded-lg bg-accent/50 p-4">
                  <p className="mb-2 text-sm font-medium text-muted-foreground">Current Site URL</p>
                  <div className="flex items-center gap-2">
                    <code className="flex-1 rounded bg-background px-3 py-2 text-sm font-mono">
                      {deployedUrl}
                    </code>
                    {deployedUrl && <CopyToClipboardControl text={deployedUrl} />}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => deployedUrl && window.open(deployedUrl, '_blank')}
                      disabled={!deployedUrl}
                    >
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <div className="rounded-lg bg-accent/50 p-4">
                  <p className="mb-2 text-sm font-medium text-muted-foreground">Canister ID</p>
                  <div className="flex items-center gap-2">
                    <code className="flex-1 rounded bg-background px-3 py-2 text-sm font-mono">
                      {canisterId}
                    </code>
                    {canisterId && <CopyToClipboardControl text={canisterId} />}
                  </div>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Configuration Options */}
        <div className="mb-8 space-y-6">
          {/* Option A: GoDaddy www-only */}
          <Card className="border-deep-blue/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-deep-blue/20 text-sm font-bold text-deep-blue">
                  A
                </span>
                GoDaddy DNS: www-only Setup
              </CardTitle>
              <CardDescription>
                Configure {wwwDomain} using GoDaddy's DNS (simpler, but apex domain won't work)
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Alert className="border-deep-blue/30 bg-deep-blue/5">
                <Info className="h-4 w-4 text-deep-blue" />
                <AlertDescription className="text-sm">
                  <strong>Note:</strong> With this setup, only {wwwDomain} will work. 
                  Visitors typing {domain} (without www) will not reach your site unless you configure a redirect in GoDaddy (see below).
                </AlertDescription>
              </Alert>

              <div className="space-y-3">
                <p className="text-sm font-medium">DNS Records to Add in GoDaddy:</p>
                
                {/* CNAME Record */}
                <div className="rounded-lg bg-accent/50 p-4">
                  <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    CNAME Record
                  </p>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <p className="text-xs text-muted-foreground">Name</p>
                        <code className="text-sm font-mono">www</code>
                      </div>
                      <CopyToClipboardControl text="www" />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <p className="text-xs text-muted-foreground">Value</p>
                        <code className="text-sm font-mono">{icTarget}</code>
                      </div>
                      <CopyToClipboardControl text={icTarget} />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">TTL</p>
                      <code className="text-sm font-mono">600 (or default)</code>
                    </div>
                  </div>
                </div>

                {/* TXT Record */}
                <div className="rounded-lg bg-accent/50 p-4">
                  <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    TXT Record
                  </p>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <p className="text-xs text-muted-foreground">Name</p>
                        <code className="text-sm font-mono">_canister-id.www</code>
                      </div>
                      <CopyToClipboardControl text="_canister-id.www" />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <p className="text-xs text-muted-foreground">Value</p>
                        {isLoading ? (
                          <Skeleton className="h-5 w-48" />
                        ) : (
                          <code className="text-sm font-mono">{canisterId || 'Loading...'}</code>
                        )}
                      </div>
                      {canisterId && <CopyToClipboardControl text={canisterId} />}
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">TTL</p>
                      <code className="text-sm font-mono">600 (or default)</code>
                    </div>
                  </div>
                </div>
              </div>

              {/* GoDaddy Forwarding Section */}
              <div className="mt-6 space-y-3 rounded-lg border border-deep-blue/30 bg-deep-blue/5 p-4">
                <div className="flex items-start gap-3">
                  <ArrowRight className="mt-0.5 h-5 w-5 shrink-0 text-deep-blue" />
                  <div className="space-y-3">
                    <div>
                      <h3 className="mb-1 font-semibold text-deep-blue">
                        Apex → www Forwarding (Recommended)
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        Set up domain forwarding so visitors who type {domain} (without www) are automatically redirected to {wwwDomain}.
                      </p>
                    </div>

                    <div className="space-y-2 text-sm">
                      <p className="font-medium">Steps to configure forwarding in GoDaddy:</p>
                      <ol className="ml-4 space-y-2 list-decimal text-muted-foreground">
                        <li>Log in to your GoDaddy account and go to your domain management page</li>
                        <li>Find and click on <strong className="text-foreground">Domain Settings</strong> or <strong className="text-foreground">Manage DNS</strong></li>
                        <li>Look for the <strong className="text-foreground">Forwarding</strong> section (may be under "Additional Settings" or "Domain Forwarding")</li>
                        <li>Click <strong className="text-foreground">Add Forwarding</strong> or <strong className="text-foreground">Set up forwarding</strong></li>
                        <li>
                          Configure the forwarding:
                          <ul className="ml-4 mt-1 space-y-1 list-disc">
                            <li><strong className="text-foreground">Forward from:</strong> {domain} (or select "@ - root domain")</li>
                            <li><strong className="text-foreground">Forward to:</strong> https://{wwwDomain}</li>
                            <li><strong className="text-foreground">Redirect type:</strong> Permanent (301)</li>
                            <li><strong className="text-foreground">Forward settings:</strong> Forward only (recommended) or Forward with masking</li>
                          </ul>
                        </li>
                        <li>Save your forwarding settings</li>
                      </ol>
                    </div>

                    <Alert className="border-deep-blue/20 bg-background/50">
                      <Info className="h-4 w-4 text-deep-blue" />
                      <AlertDescription className="text-xs">
                        <strong>Important:</strong> Domain forwarding is separate from DNS records. 
                        You still need to add the CNAME and TXT records above for {wwwDomain} to work. 
                        The forwarding just redirects {domain} → {wwwDomain}.
                      </AlertDescription>
                    </Alert>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Option B: Cloudflare apex + www */}
          <Card className="border-neon-purple/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-neon-purple/20 text-sm font-bold text-neon-purple">
                  B
                </span>
                Cloudflare DNS: Apex + www Setup
              </CardTitle>
              <CardDescription>
                Configure both {domain} and {wwwDomain} using Cloudflare (more complex, but both work)
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Alert className="border-neon-purple/30 bg-neon-purple/5">
                <Info className="h-4 w-4 text-neon-purple" />
                <AlertDescription className="text-sm">
                  <strong>Recommended:</strong> This setup allows both {domain} and {wwwDomain} to work. 
                  You must transfer your domain to Cloudflare or change your nameservers to Cloudflare.
                </AlertDescription>
              </Alert>

              <div className="space-y-3">
                <p className="text-sm font-medium">DNS Records to Add in Cloudflare:</p>
                
                {/* Apex CNAME */}
                <div className="rounded-lg bg-accent/50 p-4">
                  <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    CNAME Record (Apex)
                  </p>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <p className="text-xs text-muted-foreground">Name</p>
                        <code className="text-sm font-mono">@</code>
                      </div>
                      <CopyToClipboardControl text="@" />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <p className="text-xs text-muted-foreground">Target</p>
                        <code className="text-sm font-mono">{icTarget}</code>
                      </div>
                      <CopyToClipboardControl text={icTarget} />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Proxy status</p>
                      <code className="text-sm font-mono">DNS only (gray cloud)</code>
                    </div>
                  </div>
                </div>

                {/* www CNAME */}
                <div className="rounded-lg bg-accent/50 p-4">
                  <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    CNAME Record (www)
                  </p>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <p className="text-xs text-muted-foreground">Name</p>
                        <code className="text-sm font-mono">www</code>
                      </div>
                      <CopyToClipboardControl text="www" />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <p className="text-xs text-muted-foreground">Target</p>
                        <code className="text-sm font-mono">{icTarget}</code>
                      </div>
                      <CopyToClipboardControl text={icTarget} />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Proxy status</p>
                      <code className="text-sm font-mono">DNS only (gray cloud)</code>
                    </div>
                  </div>
                </div>

                {/* Apex TXT */}
                <div className="rounded-lg bg-accent/50 p-4">
                  <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    TXT Record (Apex)
                  </p>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <p className="text-xs text-muted-foreground">Name</p>
                        <code className="text-sm font-mono">_canister-id</code>
                      </div>
                      <CopyToClipboardControl text="_canister-id" />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <p className="text-xs text-muted-foreground">Content</p>
                        {isLoading ? (
                          <Skeleton className="h-5 w-48" />
                        ) : (
                          <code className="text-sm font-mono">{canisterId || 'Loading...'}</code>
                        )}
                      </div>
                      {canisterId && <CopyToClipboardControl text={canisterId} />}
                    </div>
                  </div>
                </div>

                {/* www TXT */}
                <div className="rounded-lg bg-accent/50 p-4">
                  <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    TXT Record (www)
                  </p>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <p className="text-xs text-muted-foreground">Name</p>
                        <code className="text-sm font-mono">_canister-id.www</code>
                      </div>
                      <CopyToClipboardControl text="_canister-id.www" />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <p className="text-xs text-muted-foreground">Content</p>
                        {isLoading ? (
                          <Skeleton className="h-5 w-48" />
                        ) : (
                          <code className="text-sm font-mono">{canisterId || 'Loading...'}</code>
                        )}
                      </div>
                      {canisterId && <CopyToClipboardControl text={canisterId} />}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Verification Section */}
        <Card className="border-neon-purple/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-neon-purple" />
              Verify Your Setup
            </CardTitle>
            <CardDescription>
              After configuring DNS records, wait 24-48 hours for propagation, then test your domain.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm text-muted-foreground">
              Once DNS changes have propagated, visiting your custom domain should load your Internet Computer site. 
              If you encounter issues, double-check that all DNS records match exactly and that you've waited sufficient time for propagation.
            </p>
            <Alert className="border-deep-blue/30 bg-deep-blue/5">
              <Info className="h-4 w-4 text-deep-blue" />
              <AlertDescription className="text-sm">
                <strong>Tip:</strong> You can use online DNS lookup tools to verify your records have propagated correctly. 
                Search for "DNS checker" or "DNS propagation checker" to find these tools.
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
