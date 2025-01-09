import dotenv from "dotenv";
import fs from "fs";

const init = async () => {
  const configPath = process.env.CONFIG_URL;
  const isLocal = process.env.TINA_PUBLIC_IS_LOCAL;

  let config;

  try {
    if (isLocal) {
      const response = await fetch(configPath);
      config = await response.json();
    } else {
      const file = fs.readFileSync(configPath);
      config = JSON.parse(file);
    }
  } catch (e) {
    throw new Error(`Error loading config:\n${e}`);
  }

  const content = JSON.stringify(config, null, 2);

  fs.writeFileSync("./public/config.json", content, "utf8");
};

dotenv.config();

init();
