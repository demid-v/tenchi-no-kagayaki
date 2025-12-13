import { type PluginConfig as SortImportsPluginConfig } from "@trivago/prettier-plugin-sort-imports";
import { type Config as PrettierConfig } from "prettier";
import { type PluginOptions as TailwindPluginOptions } from "prettier-plugin-tailwindcss";

export default {
  plugins: [
    "@trivago/prettier-plugin-sort-imports",
    // Must come last. https://dev.to/kachidk/common-prettier-plugins-installation-30hc
    "prettier-plugin-tailwindcss",
  ],
  importOrder: ["^~/styles/(.*)$", "<THIRD_PARTY_MODULES>", "^[~/]", "^[./]"],
  importOrderSortSpecifiers: true,
  importOrderSeparation: true,
} satisfies PrettierConfig & TailwindPluginOptions & SortImportsPluginConfig;
