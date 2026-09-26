import boschGsb18v50 from "@/assets/products/bosch-gsb-18v-50.jpg";
import polycab25FrWire from "@/assets/products/polycab-2-5-fr-wire.jpg";
import havells32aMcb from "@/assets/products/havells-32a-mcb.jpg";
import philips20wBatten from "@/assets/products/philips-20w-batten.jpg";
import supreme25mmPvcPipe from "@/assets/products/supreme-25mm-pvc-pipe.jpg";
import stanley65pcKit from "@/assets/products/stanley-65pc-kit.jpg";
import threeMH700Helmet from "@/assets/products/3m-h700-helmet.jpg";
import ultratechOpc53 from "@/assets/products/ultratech-opc-53.jpg";
import hiltiAnchorSet from "@/assets/products/hilti-anchor-set.jpg";
import makitaGa5030Grinder from "@/assets/products/makita-ga5030-grinder.jpg";
import honeywellNitrileGloves from "@/assets/products/honeywell-nitrile-gloves.jpg";
import crompton1hpMonoblock from "@/assets/products/crompton-1hp-monoblock.jpg";
import asianPaintsPrimer from "@/assets/products/asian-paints-primer.jpg";
import skf6205Bearing from "@/assets/products/skf-6205-bearing.jpg";
import godrejUltraLock from "@/assets/products/godrej-ultra-lock.jpg";
import wd40MultiUse from "@/assets/products/wd40-multi-use.jpg";
import finolex4sqmmFlex from "@/assets/products/finolex-4sqmm-flex.jpg";
import wipro100wFloodlight from "@/assets/products/wipro-100w-floodlight.jpg";
import legrandModularSwitch from "@/assets/products/legrand-modular-switch.jpg";
import tapariaSpannerSet from "@/assets/products/taparia-spanner-set.jpg";
import astralPvcFittingSet from "@/assets/products/astral-pvc-fitting-set.jpg";
import jkLakshmiWireMesh from "@/assets/products/jk-lakshmi-wire-mesh.jpg";
import boschGbh226 from "@/assets/products/bosch-gbh-2-26.jpg";
import genericSsBoltSet from "@/assets/products/generic-ss-bolt-set.jpg";

export const productImages: Record<string, string> = {
  "bosch-gsb-18v-50": boschGsb18v50,
  "polycab-2-5-fr-wire": polycab25FrWire,
  "havells-32a-mcb": havells32aMcb,
  "philips-20w-batten": philips20wBatten,
  "supreme-25mm-pvc-pipe": supreme25mmPvcPipe,
  "stanley-65pc-kit": stanley65pcKit,
  "3m-h700-helmet": threeMH700Helmet,
  "ultratech-opc-53": ultratechOpc53,
  "hilti-anchor-set": hiltiAnchorSet,
  "makita-ga5030-grinder": makitaGa5030Grinder,
  "honeywell-nitrile-gloves": honeywellNitrileGloves,
  "crompton-1hp-monoblock": crompton1hpMonoblock,
  "asian-paints-primer": asianPaintsPrimer,
  "skf-6205-bearing": skf6205Bearing,
  "godrej-ultra-lock": godrejUltraLock,
  "wd40-multi-use": wd40MultiUse,
  "finolex-4sqmm-flex": finolex4sqmmFlex,
  "wipro-100w-floodlight": wipro100wFloodlight,
  "legrand-modular-switch": legrandModularSwitch,
  "taparia-spanner-set": tapariaSpannerSet,
  "astral-pvc-fitting-set": astralPvcFittingSet,
  "jk-lakshmi-wire-mesh": jkLakshmiWireMesh,
  "bosch-gbh-2-26": boschGbh226,
  "generic-ss-bolt-set": genericSsBoltSet,
};

export function productImage(id: string): string | undefined {
  return productImages[id];
}
