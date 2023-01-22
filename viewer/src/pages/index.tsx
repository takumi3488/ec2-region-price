import {
  Checkbox,
  FormControl,
  FormControlLabel,
  FormGroup,
  FormLabel,
  NativeSelect,
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
import { ChangeEvent, useEffect, useState } from "react";
import Layout from "./components/Layout";

type Instance = {
  name: string;
  memory: number;
  vcpu: number;
  family: string;
  locations: Location[];
};
type Location = {
  name: string;
  price: number;
};
const Home: NextPage<Props> = ({
  instances,
  rating_updated_at,
  rate,
  locations,
}) => {
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

  // ロケーション
  const [location, setLocation] = useState("全て");

  // オススメインスタンス
  const [checked, setChecked] = useState(false);

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
        (search === "" || instance.name.includes(search)) &&
        (location === "全て" ||
          instance.locations
            .map((location) => location.name)
            .includes(location)) &&
        (!checked ||
          [
            "t4g",
            "t3",
            "t3a",
            "m6g",
            "m6i",
            "m6a",
            "c7g",
            "c6i",
            "c6a",
            "r6g",
            "r6i",
            "r7i",
            "p4d",
            "dl1",
            "inf1",
            "g5",
            "g5g",
          ]
            .map((name) => `${name}.`)
            .some((name) => instance.name.startsWith(name)))
      );
    });
    setFilteredInstances(newInstances);
  }, [instances, selectedFamily, search, location, checked]);

  const [hoursPerDay, setHoursPerDay] = useState<number>(24);
  const handleHoursPerDay = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setHoursPerDay(+e.target.value);
  };

  return (
    <Layout rate={rate} rating_updated_at={rating_updated_at}>
      <Box component="aside" sx={{ gridArea: "aside" }}>
        <Box sx={{ display: "flex", marginBottom: "1rem" }}>
          <FormGroup>
            <FormControlLabel
              control={
                <Checkbox
                  checked={checked}
                  onChange={(e) => setChecked(e.target.checked)}
                />
              }
              label="人気のインスタンスのみ表示"
            />
          </FormGroup>
        </Box>
        <Box component="span" sx={{ display: "flex", marginBottom: "1rem" }}>
          <TextField
            variant="standard"
            sx={{ marginBottom: "1.5rem" }}
            onChange={handleSearch}
          />
          <Typography>から始まる</Typography>
        </Box>
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
        <Box
          component="span"
          sx={{
            display: "flex",
            margin: "1rem auto",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Typography>リージョンを選択</Typography>
          <NativeSelect
            defaultValue={"全て"}
            onChange={(e) => setLocation(e.target.value)}
          >
            <option value="全て">全て</option>
            {locations.map((location) => (
              <option value={location} key={location}>
                {location}
              </option>
            ))}
          </NativeSelect>
        </Box>
        <Table sx={{ "& th,td": { padding: "0.3rem" } }}>
          <TableHead>
            <TableRow>
              <TableCell>インスタンス名</TableCell>
              <TableCell>vCPU(GB)</TableCell>
              <TableCell>メモリ(GB)</TableCell>
              <TableCell>タイプ</TableCell>
              <TableCell>最安料金($/h)</TableCell>
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
                <TableCell>
                  {
                    instance.locations.sort((a, b) => a.price - b.price)[0]
                      .price
                  }
                </TableCell>
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
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow>
                  <TableCell>{selected.vcpu}</TableCell>
                  <TableCell>{selected.memory}</TableCell>
                  <TableCell>{selected.family}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
            <Box sx={{ textAlign: "center", margin: "1rem" }}>
              一日当たり
              <TextField
                variant="standard"
                sx={{ width: "1.2rem", marginTop: "-4px" }}
                onChange={handleHoursPerDay}
                value={hoursPerDay}
              />
              時間使用(円/月に反映)
            </Box>
            <Table sx={{ width: "auto", margin: "auto" }} size="small">
              <TableHead>
                <TableRow>
                  <TableCell>リージョン</TableCell>
                  <TableCell>価格(USD/時)</TableCell>
                  <TableCell>価格(円/時)</TableCell>
                  <TableCell>価格(円/月=30.5日)</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {selected.locations
                  .filter((loc) => loc.name === location || location === "全て")
                  .map((location) => (
                    <TableRow key={location.name}>
                      <TableCell>{location.name}</TableCell>
                      <TableCell>{location.price}</TableCell>
                      <TableCell>
                        {Math.round(location.price * rate * 100) / 100}
                      </TableCell>
                      <TableCell>
                        {Math.round(
                          location.price * rate * 100 * 30.5 * hoursPerDay
                        ) / 100}
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </Paper>
        )}
      </Box>
    </Layout>
  );
};

type Props = {
  instances: Instance[];
  rating_updated_at: string;
  rate: number;
  locations: string[];
};
export const getStaticProps: GetStaticProps<Props> = async () => {
  const extractNum = (instance: Instance): number => {
    const pre = instance.name.split(".")[0];
    const num = pre.match(/\d/);
    return num ? +num[0] : 0;
  };
  const ratings = await (
    await fetch("https://dotnsf-fx.herokuapp.com/")
  ).json();
  const instances: Instance[] = await (
    await fetch(`${process.env.APP_URL}/ec2.json`)
  ).json();
  const sortedInstances = instances
    .sort((a, b) => a.vcpu - b.vcpu)
    .sort((a, b) => a.memory - b.memory)
    .sort((a, b) => (a.name.split(".")[0] < b.name.split(".")[0] ? -1 : 1))
    .sort((a, b) => extractNum(b) - extractNum(a))
    .map((instance) => {
      return {
        ...instance,
        locations: instance.locations.sort((a, b) => a.price - b.price),
      };
    });
  const locations = Array.from(
    new Set(
      instances
        .map((instance) => instance.locations.map((location) => location.name))
        .flat()
    )
  ) as string[];
  return {
    props: {
      instances: sortedInstances,
      rating_updated_at: ratings.datetime.split(" ")[0],
      rate: ratings.rate.USDJPY,
      locations: locations.sort((a, b) => (a < b ? -1 : 1)),
    },
    revalidate: 1800,
  };
};

export default Home;
