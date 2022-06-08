import {
  FormControl,
  FormControlLabel,
  FormLabel,
  Paper,
  Radio,
  RadioGroup,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import { Box } from "@mui/system";
import type { GetStaticProps, NextPage } from "next";
import Head from "next/head";
import { ChangeEvent, useEffect, useState } from "react";

type Instance = {
  name: string;
  memory: number;
  vcpu: number;
  os: string;
  family: string;
  locations: Location[];
};
type Location = {
  name: string;
  price: number;
};
const Home: NextPage<Props> = ({ instances, rating_updated_at, rate }) => {
  const [selected, setSelected] = useState<Instance>(instances[0]);

  // インスタンスタイプ
  const [selectedFamily, setSelectedFamily] = useState<string>("すべて");
  const selectFamily = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSelectedFamily(value);
  };

  // 検索インスタンス名
  const [search, setSearch] = useState<string>("");
  const handleSearch = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setSearch(e.target.value);
  };

  // フィルター済みインスタンス一覧
  const [filteredInstances, setFilteredInstances] =
    useState<Instance[]>(instances);
  const selectInstance = (name: string) => {
    const newSelected = instances.find((instance) => instance.name === name);
    if (newSelected) setSelected(newSelected);
  };
  useEffect(() => {
    const newInstances = instances.filter((instance) => {
      return (
        (selectedFamily === "すべて" || instance.family === selectedFamily) &&
        (search === "" || instance.name.includes(search))
      );
    });
    setFilteredInstances(newInstances);
  }, [selectedFamily, search]);
  return (
    <>
      <Head>
        <title>EC2 Region Price</title>
      </Head>
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
        <Box component="header" sx={{ gridArea: "header" }}>
          <Typography component="h1" variant="h5" sx={{ textAlign: "center" }}>
            EC2の料金をリージョン毎に並べて見たい
          </Typography>
          <Typography sx={{ textAlign: "center" }}>
            {rate}円/USD (最終更新日: {rating_updated_at})
          </Typography>
        </Box>
        <Box component="aside" sx={{ gridArea: "aside" }}>
          <TextField
            variant="standard"
            placeholder="インスタンス名で絞り込み"
            sx={{ marginBottom: "1.5rem" }}
            fullWidth
            onChange={handleSearch}
          />
          <FormControl>
            <FormLabel>インスタンスタイプ</FormLabel>
            <RadioGroup row value={selectedFamily} onChange={selectFamily}>
              {[
                "すべて",
                "汎用",
                "コンピューティング最適化",
                "メモリ最適化",
                "高速コンピューティング",
                "ストレージ最適化",
              ].map((family) => (
                <FormControlLabel
                  value={family}
                  control={<Radio />}
                  label={family}
                  key={family}
                />
              ))}
            </RadioGroup>
          </FormControl>
          <Table sx={{ "& th,td": { padding: "0.3rem" } }}>
            <TableHead>
              <TableRow>
                <TableCell>インスタンス名</TableCell>
                <TableCell>vCPU(GB)</TableCell>
                <TableCell>メモリ(GB)</TableCell>
                <TableCell>タイプ</TableCell>
                <TableCell>OS</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredInstances.map((instance) => (
                <TableRow
                  sx={{
                    "&:hover": { cursor: "pointer", background: "#f0f0f0" },
                  }}
                  onClick={() => selectInstance(instance.name)}
                  key={instance.name}
                >
                  <TableCell>{instance.name}</TableCell>
                  <TableCell>{instance.vcpu}</TableCell>
                  <TableCell>{instance.memory}</TableCell>
                  <TableCell sx={{ fontSize: "0.7rem" }}>
                    {instance.family}
                  </TableCell>
                  <TableCell>{instance.os}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Box>
        <Box component="main" sx={{ gridArea: "main" }}>
          {selected && (
            <Paper sx={{ padding: "1rem" }} elevation={3}>
              <Typography
                component="h2"
                variant="h5"
                fontWeight="bold"
                sx={{ textAlign: "center" }}
              >
                {selected.name}
              </Typography>
              <Table sx={{ width: "auto", margin: "auto" }}>
                <TableHead>
                  <TableRow>
                    <TableCell>vCPU(GB)</TableCell>
                    <TableCell>メモリ(GB)</TableCell>
                    <TableCell>タイプ</TableCell>
                    <TableCell>OS</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow>
                    <TableCell>{selected.vcpu}</TableCell>
                    <TableCell>{selected.memory}</TableCell>
                    <TableCell>{selected.family}</TableCell>
                    <TableCell>{selected.os}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
              <Typography
                sx={{
                  marginTop: "2rem",
                  fontSize: "0.8rem",
                  textAlign: "center",
                }}
              >
                -価格は1時間当たりです-
              </Typography>
              <Table sx={{ width: "auto", margin: "auto" }} component={Paper}>
                <TableHead>
                  <TableRow>
                    <TableCell>リージョン</TableCell>
                    <TableCell>価格(円)</TableCell>
                    <TableCell>価格(USD)</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {selected.locations.map((location) => (
                    <TableRow key={location.name}>
                      <TableCell>{location.name}</TableCell>
                      <TableCell>
                        {Math.round(location.price * rate * 100) / 100}
                      </TableCell>
                      <TableCell>{location.price}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Paper>
          )}
        </Box>
      </Box>
    </>
  );
};

const fetcher = async (url: string): Promise<Instance[]> => {
  const res = await fetch(url);
  const data: Instance[] = await res.json();
  return data;
};

type Props = {
  instances: Instance[];
  rating_updated_at: string;
  rate: number;
};
export const getStaticProps: GetStaticProps<Props> = async () => {
  const ratings = await (
    await fetch("https://dotnsf-fx.herokuapp.com/")
  ).json();
  const instances = await(
    await fetch(`${process.env.APP_URL}/instance.json`)
  ).json();
  return {
    props: {
      instances,
      rating_updated_at: ratings.datetime.split(" ")[0],
      rate: ratings.rate.USDJPY,
    },
    revalidate: 24 * 3600,
  };
};

export default Home;
