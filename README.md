# core-data-places

## Local Development

#### Requirements
- Node 20.x
- Netlify CLI

To start, run:
```
npm install && netlify dev
```

## Getting Started

#### Create a content repository
On GitHub, create a new content repository. The posts and paths records you create will be stored here, as well as any i18n and your project config.

Use the [core-data-tina-cms-content](https://github.com/performant-software/core-data-tina-cms-content) repository as your template and modify the `/content/settings/config.json` as appropriate for your project. Make sure to set the properties in the `typesense` and `core_data` sections correctly.

#### Create a new Personal Access Token

In your developer settings, create a new personal access token with access to your newly created repository with read/write permissions to code.

#### Add an IAM user to AWS
If using media uploads, you'll need to create a new IAM user to access the S3 bucket for media storage. All media for TinaCMS content is stored in the `core-data-tina-cms` bucket and access to sub-folders is given to users. Create a new user with the following inline policy:

```
{
 "Version":"2012-10-17",
 "Statement": [
   {
     "Sid": "AllowListingOfFolder",
     "Action": ["s3:ListBucket"],
     "Effect": "Allow",
     "Resource": ["arn:aws:s3:::core-data-tina-cms"],
     "Condition":{"StringLike":{"s3:prefix":["<folder-name>/*"]}}
   },
   {
     "Sid": "AllowAllS3ActionsInFolder",
     "Effect": "Allow",
     "Action": ["s3:*"],
     "Resource": ["arn:aws:s3:::core-data-tina-cms/<folder-name>/*"]
   }
 ]
}
```

Replace `<folder-name>` with the name of the folder in the S3 bucket where the media should be stored. As a naming convention, the name of the folder should be the same as the name of the GitHub repository created above.

After the user is created, use the "Security Credentials" tab to create an access key/secret for the user.

#### Deploy to Netlify

Create a new site on Netlify deployed from the `core-data-places` repository. Set all of the environment variables in .env.example as appropriate.

## Content Migration

If you're migrating content from a website that is currently storing content in the same repository as the website code, you can follow these steps to move the content.

#### Move MDX

Move the `.mdx` files in the `content/about`, `content/paths`, `/content/posts` directories to the same directories in your new content repository. Move any localization files from `/content/ui` to `content/i18n` in your new repository.

#### Move media

If using Astro, media will typically be stored in `/src/assets`. These media files will need to be moved to the newly created S3 bucket and the paths in the `.mdx` files will need to be updated accordingly.