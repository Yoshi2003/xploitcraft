# CloudFront Configuration Overview
## Hi everyone! 👋 I chose amazon AWS cloudfront to use as my CDN.

## This README explains how I set up my Amazon CloudFront distribution for my application. Below, I'll walk you through the key configurations I've chosen, why I made those decisions, and what they do for my setup.

## Origin Settings

### Origin Domain Name
I configured the origin domain name as proxyauthrequired.com. This is my custom domain that resolves to my server, which is running behind CloudFront. All requests from CloudFront are forwarded to this origin.

### Protocol
I selected HTTPS Only as the protocol for communication between CloudFront and my origin. This ensures that all traffic to my origin is encrypted, providing an added layer of security.

### HTTPS Port
The HTTPS port is set to 443, which is the standard port for encrypted web traffic.

### Minimum Origin SSL Protocol
I configured this to TLSv1.2 to ensure secure communication between CloudFront and my origin using a modern encryption protocol.

### Origin Path
I left the origin path empty, so all requests are routed to the root path / on my origin server.

## Cache Behavior Settings

### Viewer Protocol Policy
For the viewer protocol policy, I currently allow both HTTP and HTTPS. This means users can access my site using either protocol. While this works for now, my intention is to make all traffic HTTPS-only once everything is fully validated.

### Allowed HTTP Methods
I enabled GET, HEAD, OPTIONS, PUT, POST, PATCH, DELETE as the allowed HTTP methods. This allows my application to support all types of requests, including those needed for API functionality.

### Compress Objects Automatically
I turned on automatic compression for text-based content like HTML, CSS, and JavaScript. This reduces the size of the data being transferred, making my app faster for users and saving bandwidth costs.

## Cache Key and Origin Requests

### Cache Policy
I’m using the CachingDisabled policy. This disables caching entirely for my content, ensuring every request is forwarded to the origin. This is especially important for my APIs, as their responses are dynamic and need to be generated fresh for each request.

### Origin Request Policy
For the origin request policy, I selected AllViewer. This means CloudFront forwards all headers, query strings, and cookies from the client to my origin. This setup is critical for ensuring that user-specific data and authentication tokens are passed to my backend correctly.

### Response Headers Policy
I applied the CORS-With-Preflight response headers policy. This adds the necessary CORS headers for my application, including support for preflight requests (OPTIONS). It ensures my frontend (running separately) can make requests to my backend without cross-origin issues.

## Security Configuration

### Web Application Firewall (WAF)
I’ve enabled AWS WAF for my distribution to protect against common vulnerabilities and malicious traffic. This includes:
Defending against bots and other malicious actors.
ensuring 
Ensures that my app isn’t vulnerable to malicious scripts being injected.
Rate limiting and IP blocking help protect against high volumes of requests that could overwhelm my app.

I did not enable SQL injection protection because I use Mongodb as my database-- not SQL.

#### Rate Limiting
I’ve set a rate limit of 300 requests per IP per 5-minute period. This helps prevent API request abuse and DDOS attacks while ensuring regular users don’t face any restrictions.

## Alternate Domain Name (CNAME) and SSL

### Alternate Domain Name
I configured the alternate domain name as proxyauthrequired.com. This allows my custom domain to be served through CloudFront.

### Custom SSL Certificate
I’m using an SSL certificate issued by AWS Certificate Manager (ACM). This ensures secure communication between my users and CloudFront using HTTPS.

## Performance Settings

### Price Class
I selected Use all edge locations (best performance). This ensures my content is served from the nearest CloudFront edge location to the user, providing the best performance possible globally.

### Supported HTTP Versions
I enabled support for HTTP/2 and HTTP/3:

HTTP/2 allows for faster data transfer with features like multiplexing.
HTTP/3 is even faster, especially for users on unreliable networks, as it uses the QUIC protocol.


## IPv6
I enabled IPv6 to ensure my application is accessible on modern networks that use IPv6 addresses. This makes my app future-proof and accessible to more users worldwide.

## DNS Configuration

### To route traffic through CloudFront, I configured the following DNS records in my domain provider:

CNAME Record:
Name: proxyauthrequired.com
Value: My CloudFront distribution domain (e.g., d1234abcd.cloudfront.net).
This setup ensures that requests to my custom domain are routed through CloudFront.

### Why This Setup Works for Me

#### This configuration gives me:

Global Availability: Content is served from CloudFront edge locations for low latency.
Secure Communication: Both viewer-to-CloudFront and CloudFront-to-origin communication use HTTPS.
Dynamic Content: Disabling caching ensures my APIs return fresh data for every request.
Scalability: AWS WAF protects my app from malicious traffic, allowing it to handle high traffic safely.

#### I hope this gives you a clear understanding of my CloudFront/CDN setup. Feel free to email me at carterperez-dev@ProxyAuthRequired.com for any questions or suggest improvements! 😊  

