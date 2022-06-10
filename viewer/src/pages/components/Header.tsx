import { MenuItem, Select, Typography } from "@mui/material";
import { Box } from "@mui/system";
import Link from "next/link";
import { useRouter } from "next/router";
import { FC } from "react";

type Props = {
  rating_updated_at: string;
  rate: number;
};
const urls: { [key: string]: string } = { "/": "EC2", "/lambda": "AWS Lambda" };
const Header: FC<Props> = ({ rating_updated_at, rate }) => {
  const router = useRouter();
  const { pathname } = router;
  const title = urls[pathname];
  return (
    <Box component="header" sx={{ gridArea: "header" }}>
      <Typography component="h1" variant="h5" sx={{ textAlign: "center" }}>
        <Select value={pathname} label={title}>
          {Object.keys(urls).map((url) => (
            <MenuItem value={url} onClick={() => router.replace(url)} key={url}>
              <Typography sx={{ display: "inline-block", width: "100%" }}>
                {urls[url]}
              </Typography>
            </MenuItem>
          ))}
        </Select>{" "}
        の料金をリージョン毎に並べて見たい
      </Typography>
      <Typography sx={{ textAlign: "center" }}>
        {rate}円/USD (最終更新日: {rating_updated_at})
      </Typography>
    </Box>
  );
};

export default Header;
