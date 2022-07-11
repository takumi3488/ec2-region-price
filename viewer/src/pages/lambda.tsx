import {
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { Box } from "@mui/system";
import type { GetStaticProps, NextPage } from "next";
import { useEffect, useState } from "react";
import Layout from "./components/Layout";
import NumberInput from "./components/NumberInput";

type Arch = {
  name: string;
  regions: Region[];
};
type Region = {
  region: string;
  price: number;
};
const Lambda: NextPage<Props> = ({ archs, rating_updated_at, rate }) => {
  const [selected, setSelected] = useState<"x86" | "Arm">("x86");
  const [regions, setRegions] = useState<Region[]>([]);
  useEffect(() => {
    const arch = archs.find((arch) => arch.name === selected);
    if (arch) {
      setRegions(arch.regions);
    }
  }, [selected, archs]);

  const [seconds, setSeconds] = useState<number>(300);
  const [memory, setMemory] = useState<number>(512);
  return (
    <Layout rate={rate} rating_updated_at={rating_updated_at}>
      <Box component="aside" sx={{ gridArea: "aside" }}>
        <Typography sx={{ textAligh: "center" }}>
          アーキテクチャを選択
        </Typography>
        <List sx={{ padding: "1rem", width: "6rem" }}>
          {(["x86", "Arm"] as ("x86" | "Arm")[]).map((arch) => (
            <ListItem
              sx={{ background: selected === arch ? "#6bf" : "#ddd" }}
              key={arch}
            >
              <ListItemButton onClick={() => setSelected(arch)}>
                <ListItemText primary={arch} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Box>
      <Box component="main" sx={{ gridArea: "main" }}>
        <Typography>
          一日当たり
          <NumberInput
            value={seconds}
            onChange={(e) => setSeconds(+e.target.value || 0)}
          />
          秒使用 / メモリ
          <NumberInput
            value={memory}
            onChange={(e) => setMemory(+e.target.value || 0)}
          />
          MB (月利用料に反映されます)
        </Typography>
        <Typography>
          料金はメモリ1GB・利用時間1時間当たりです(実際の課金は1秒単位で行われます)
        </Typography>
        <Table sx={{ maxWidth: "45rem" }}>
          <TableHead>
            <TableRow>
              <TableCell>リージョン</TableCell>
              <TableCell>料金(USD)</TableCell>
              <TableCell>料金(円)</TableCell>
              <TableCell>利用料(円/月)</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {regions.map((region) => (
              <TableRow key={region.region}>
                <TableCell>{region.region}</TableCell>
                <TableCell>
                  {Math.round(region.price * 3600 * 100000) / 100000}
                </TableCell>
                <TableCell>
                  {Math.round(region.price * 3600 * 100000 * rate) / 100000}
                </TableCell>
                <TableCell>
                  {Math.round(
                    ((region.price * seconds * rate * 30.5 * memory) / 1024) *
                      100000
                  ) / 100000}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Box>
    </Layout>
  );
};

type Props = {
  archs: Arch[];
  rating_updated_at: string;
  rate: number;
};
export const getStaticProps: GetStaticProps<Props> = async () => {
  const ratings = await (
    await fetch("https://dotnsf-fx.herokuapp.com/")
  ).json();
  const archs: Arch[] = await (
    await fetch(`${process.env.APP_URL}/lambda.json`)
  ).json();
  const sortedArchs = archs.map((arch) => {
    return { ...arch, region: arch.regions.sort((a, b) => a.price - b.price) };
  });
  return {
    props: {
      archs,
      rating_updated_at: ratings.datetime.split(" ")[0],
      rate: ratings.rate.USDJPY,
    },
    revalidate: 1800,
  };
};

export default Lambda;
