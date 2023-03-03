# [PhotoTweak](https://phototweak.vercel.app/)

PhotoTweak is a web application that allows you to edit photos from text commands. It uses [`styleclip`](https://replicate.com/orpatashnik/styleclip/versions/7af9a66f36f97fee2fece7dcc927551a951f0022cbdd23747b9212f23fc17021) from [`Replicate`](https://replicate.com/) to generate images. It is bootstrapped with the [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

[![PhotoTweak](./public/screenshot.png)](https://phototweak.vercel.app/)

## Tech Stack

- [Next.js](https://nextjs.org)
- [Tailwind CSS](https://tailwindcss.com)
- [Replicate API](https://replicate.com/account)

## Features

- Upload photos to cloudinary and delete them programmatically
- Edit photos from text commands

## Installation

### 1. Clone the repository

```bash
git clone https://github.com/sadmann7/photo-tweak.git
```

### 2. Install dependencies

```bash
yarn install
```

### 3. Create a `.env` file

Create a `.env` file in the root directory and add the environment variables as shown in the `.env.example` file. You can get the Replicate API key from [here](https://replicate.com/account). You need to create an account if you don't have one. Cloudinary credentials can be obtained from [here](https://cloudinary.com/console).

### 4. Run the application

```bash
yarn run dev
```

The application will be available at `http://localhost:3000`.

## Deployment

The easiest way to deploy the Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out the [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.
