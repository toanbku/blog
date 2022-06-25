---
setup: |
  import Layout from '../../layouts/BlogPost.astro'
  import Cool from '../../components/Author.astro'
title: Reflutter and signed app!
publishDate: 25 Jun 2022
name: Toan Ho
description: How can we reflutter!
twitterLink: https://twitter.com/toanbku
---

<Cool name={frontmatter.name} href={frontmatter.twitterLink} client:load />

## How to reFlutter

### Step 1: Bind network proxy to flutter app

`reflutter [file]`

Example: `reflutter STEPN_0.6.3_apkcombo.com.apk`

- Enter your IP

Example output

```
Example: (192.168.1.154) etc.
Please enter your BurpSuite IP: 192.168.1.1

SnapshotHash: d56742caf7b3b3f4bd2df93a9bbb5503
The resulting apk file: ./release.RE.apk
Please sign,align the apk file

Configure Burp Suite proxy server to listen on *:8083
Proxy Tab -> Options -> Proxy Listeners -> Edit -> Binding Tab

Then enable invisible proxying in Request Handling Tab
Support Invisible Proxying -> true
```

## Step 2: Signed the APK file

`java -jar uber-apk-signer-1.2.1.jar --apk release.RE.apk`

p/s: need to download [uber apk signed](https://github.com/patrickfav/uber-apk-signer) and install java to your machine

Example output

```
source:
	/Users/macbook/Personal/reflutter
zipalign location: BUILT_IN
	/var/folders/f1/d_qscgz57_13n3nqn57n8n940000gn/T/uapksigner-5739383384299189746/mac-zipalign-29_0_24534048588620225522.tmp
keystore:
	[0] 161a0018 /private/var/folders/f1/d_qscgz57_13n3nqn57n8n940000gn/T/temp_552239209646415017_debug.keystore (DEBUG_EMBEDDED)

01. release.RE.apk

	SIGN
	file: /Users/macbook/Personal/reflutter/release.RE.apk (122.26 MiB)
	checksum: 94fe87a4d7d691fa013fd7d154e35f13304ab5b765a4732cc89ea52548e15971 (sha256)
	- zipalign success
	- sign success

	VERIFY
	file: /Users/macbook/Personal/reflutter/release.RE-aligned-debugSigned.apk (122.26 MiB)
	checksum: 8077360e783e39d3d591545462c465ea7868023e480fef00b17f1ecf13707f2f (sha256)
	- zipalign verified
	- signature verified [v1, v2, v3]
		61 warnings
		Subject: CN=Android Debug, OU=Android, O=US, L=US, ST=US, C=US
		SHA256: 1e08a903aef9c3a721510b64ec764d01d3d094eb954161b62544ea8f187b5953 / SHA256withRSA
		Expires: Fri Mar 11 03:10:05 ICT 2044

[Sun May 01 17:56:01 ICT 2022][v1.2.1]
Successfully processed 1 APKs and 0 errors in 15.73 seconds.
```

Tadaa! Your `release.RE-aligned-debugSigned.apk` is ready to use
