import { Box } from "@mui/system";
import { Children, FC, ReactNode, useEffect } from "react";
import Head from "next/head";
import Header from "./Header";

type Props = {
  rating_updated_at: string;
  rate: number;
  children: ReactNode;
};
const Layout: FC<Props> = (props) => {
  return (
    <Box
      sx={{
        width: "clamp(1080px, calc(100vw - 3rem), 1920px)",
        padding: "1rem",
        margin: "auto",
        display: "grid",
        gridTemplate: `"header header" auto
                       "aside  main  " auto
                      / 2fr    3fr   `,
        gridGap: "1rem",
      }}
    >
      <Head>
        <title>EC2 Region Price</title>
      </Head>
      <Header {...props} />
      {props.children}
    </Box>
  );
};

export default Layout;
