import "./globals.css";
import Navbar from "@/components/Navbar";
import { config } from "@fortawesome/fontawesome-svg-core";
import "@fortawesome/fontawesome-svg-core/styles.css";
config.autoAddCss = false;
import "./nprogress.css";
import { Analytics } from "@vercel/analytics/react";
import Chat from "@/components/Chat";
import ClientTopProgressBar from "@/components/ClientTopProgressBar";

export const metadata = {
	title: "Ronaltama | Portfolio",

	description:
		"Edwin Ronaltama Mabrur - Software Engineer & Full Stack Developer specializing in Smart Systems and IoT. Building integrated solutions for hospitality industry.",

	author: "Edwin Ronaltama Mabrur",
	siteUrl: "https://ronaltama.vercel.app",
	applicationName: "Ronaltama Portfolio",

	keywords: [
		"ronaltama",
		"edwin ronaltama",
		"edwin ronaltama mabrur",
		"software engineer",
		"full stack developer",
		"iot developer",
		"smart system",
		"uns",
		"golang developer",
		"vue developer",
	],

	openGraph: {
		type: "website",
		url: "https://ronaltama.vercel.app",
		title: "Ronaltama | Portfolio",
		site_name: "Ronaltama | Portfolio",
		description: "Edwin Ronaltama Mabrur - Software Engineer & Full Stack Developer specializing in Smart Systems and IoT.",
		width: 1200,
		height: 630,
		images: [
			{
				url: "/og-image-rev.png",
				alt: "Ronaltama Portfolio",
			},
		],
	}
};

export default function RootLayout({ children }) {
	return (
		<html lang="en">
			<body>
				<ClientTopProgressBar />
				<Navbar />
				{children}
				<Chat />
				<Analytics />
			</body>
		</html>
	);
}
