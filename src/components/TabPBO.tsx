// TabPBO.tsx - Module for "Producto Bajo Observación" (PBO)
import React, { useState, useEffect, useRef } from 'react';
import { 
  Plus, 
  Trash2, 
  FileCheck, 
  Search, 
  ArrowRightLeft, 
  Layers, 
  CheckCircle, 
  XCircle, 
  AlertOctagon, 
  ShieldAlert, 
  TrendingUp, 
  ClipboardList, 
  Barcode, 
  Database,
  Lock,
  Unlock,
  Eye,
  Info,
  Calendar,
  Layers3,
  RefreshCw,
  Printer,
  ChevronRight,
  Sparkles
} from 'lucide-react';
import { LotePBO, Paleta, Reproceso } from '../types';
import { getLotesPBO, saveLotePBO, deleteLotePBO, getPaletasPBO, savePaletasPBO, getReprocesosPBO, saveReprocesoPBO, deleteReprocesoPBO, deletePaletaPBO } from '../db';

export interface CatalogoProductoPBO {
  codigo: string;
  nombre: string;
  formato: string;
}

export const CATALOGO_PRODUCTOS_PBO: CatalogoProductoPBO[] = [
  { formato: "8.4 onza", nombre: "CUERPO LATA ICE 250ML/8.4OZ", codigo: "Y00001" },
  { formato: "8.4 onza", nombre: "CUERPO LATA ICE 250ML/8.4OZ PLIBRE", codigo: "Y00002" },
  { formato: "8.4 onza", nombre: "CUERPO LATA ICE 250ML/8.4OZ ZFRANCA", codigo: "Y00003" },
  { formato: "8.4 onza", nombre: "CUERPO LATA LIGHT 250ML/8.4OZ", codigo: "Y00004" },
  { formato: "8.4 onza", nombre: "CUERPO LATA LIGHT 250ML/8.4OZ PLIBRE", codigo: "Y00005" },
  { formato: "8.4 onza", nombre: "CUERPO LATA LIGHT 250ML/8.4OZ ZFRANCA", codigo: "Y00006" },
  { formato: "12 onza", nombre: "CUERPO LATA MALTIN  355ML/12OZ", codigo: "Y00007" },
  { formato: "10 onza", nombre: "CUERPO LATA MALTIN 10OZ EXP V2", codigo: "Y00008" },
  { formato: "10 onza", nombre: "CUERPO LATA MALTIN 295ML/10OZ T-202", codigo: "Y00009" },
  { formato: "8.4 onza", nombre: "CUERPO LATA PILSEN  250ML/8.4OZ", codigo: "Y00010" },
  { formato: "12 onza Sleek", nombre: "CUERPO LATA PILSEN SLEEK 12OZ", codigo: "Y00011" },
  { formato: "12 onza", nombre: "CUERPO LATA PILSEN  355ML/12OZ PLIBRE", codigo: "Y00012" },
  { formato: "8.4 onza", nombre: "CUERPO LATA PILSEN 8.45OZ EXP", codigo: "Y00013" },
  { formato: "8.4 onza", nombre: "CUERPO LATA PILSEN 250ML/8.4OZ EXP COL", codigo: "Y00014" },
  { formato: "8.4 onza", nombre: "CUERPO LATA PILSEN 250ML/8.4OZ PLIBRE", codigo: "Y00015" },
  { formato: "8.4 onza", nombre: "CUERPO LATA PILSEN 250ML/8.4OZ ZF PP", codigo: "Y00016" },
  { formato: "8.4 onza", nombre: "CUERPO LATA SOLERA  250ML/8.4OZ", codigo: "Y00017" },
  { formato: "8.4 onza", nombre: "CUERPO LATA SOLERA  250ML/8.4OZ PLIBRE", codigo: "Y00018" },
  { formato: "8.4 onza", nombre: "CUERPO LATA SOLERA 250ML/8.4OZ ZFRANCA", codigo: "Y00019" },
  { formato: "12 onza", nombre: "CUERPO LATA PEPSI LIGHT 355 ML 12 OZ", codigo: "Y00047" },
  { formato: "12 onza", nombre: "CUERPO LATA 7UP LIGHT 355 ML 12 OZ", codigo: "Y00048" },
  { formato: "12 onza", nombre: "CUERPO LATA PEPSI 355 ML 12 OZ", codigo: "Y00049" },
  { formato: "12 onza", nombre: "CUERPO LATA SODA EVERVESS 355 ML 12 OZ", codigo: "Y00050" },
  { formato: "12 onza", nombre: "CUERPO LATA GOLDEN KOLA 355 ML 12 OZ", codigo: "Y00052" },
  { formato: "12 onza", nombre: "CUERPO LATA GOLDEN NARANJA 355 ML 12 OZ", codigo: "Y00053" },
  { formato: "12 onza", nombre: "CUERPO LATA GOLDEN UVA 355 ML 12 OZ", codigo: "Y00054" },
  { formato: "12 onza", nombre: "CUERPO LATA GOLDEN MANZANA 355 ML 12 OZ", codigo: "Y00055" },
  { formato: "12 onza", nombre: "CUERPO LATA GOLDEN PIÑA 355 ML 12 OZ", codigo: "Y00056" },
  { formato: "12 onza", nombre: "CUERPO LATA DURAZNO YUKERY 335 ML 12 OZ", codigo: "Y00058" },
  { formato: "12 onza", nombre: "CUERPO LATA MANZANA YUKERY 335 ML 12 OZ", codigo: "Y00059" },
  { formato: "12 onza", nombre: "CUERPO LATA PERA YUKERY 335 ML 12 OZ", codigo: "Y00060" },
  { formato: "12 onza", nombre: "CUERPO LATA AGUAKINA  355 ML 12 OZ", codigo: "Y00061" },
  { formato: "12 onza", nombre: "CUERPO LATA 7UP 355 ML 12 OZ", codigo: "Y00062" },
  { formato: "8.4 onza", nombre: "CUERPO LATA ICE 250ML/8.4OZ ZF S. ELENA", codigo: "Y00094" },
  { formato: "8.4 onza", nombre: "CUERPO LATA LIGHT 250ML/8.4OZ Z S.ELENA", codigo: "Y00095" },
  { formato: "8.4 onza", nombre: "CUERPO LATA PILSEN 250ML/8.4OZ ZF SEU", codigo: "Y00096" },
  { formato: "8.4 onza", nombre: "CUERPO LATA SOLERA 250ML/8.4OZ ZF S. ELE", codigo: "Y00097" },
  { formato: "8.4 onza", nombre: "CUERPO LATA ICE 250ML/8.4OZ EXPORT", codigo: "Y00098" },
  { formato: "8.4 onza", nombre: "CUERPO LATA ICE 250ML/8.4OZ EXP COL", codigo: "Y00099" },
  { formato: "12 onza", nombre: "CUERPO LATA MANGO YUKERY 335 ML 12 OZ", codigo: "Y00100" },
  { formato: "12 onza", nombre: "CUERPO LATA PILSEN  355ML/12OZ EXP", codigo: "Y00105" },
  { formato: "12 onza", nombre: "CUERPO LATA MALTIN  355ML/12OZ CARIBE", codigo: "Y00106" },
  { formato: "8.4 onza", nombre: "CUERPO LATA PLAIN 250ML/8.4OZ", codigo: "Y00107" },
  { formato: "8.4 onza", nombre: "CUERPO LATA SOLERA LIGHT 250ML/8.4OZ", codigo: "Y00108" },
  { formato: "8.4 onza", nombre: "CUERPO LATA MALTIN 250ML/8.4OZ", codigo: "Y00109" },
  { formato: "12 onza", nombre: "CUERPO LATA ICE 355ML/12OZ", codigo: "Y00110" },
  { formato: "8.4 onza", nombre: "CUERPO LATA SOLERA LIGHT 250ML/8.4OZ PL", codigo: "Y00111" },
  { formato: "8.4 onza", nombre: "CUERPO LATA SOLERA LIGHT 250ML/8.4OZ ZF", codigo: "Y00113" },
  { formato: "12 onza", nombre: "CUERPO LATA ICE 355ML/12OZ PL", codigo: "Y00114" },
  { formato: "12 onza", nombre: "CUERPO LATA ICE 355ML/12OZ ZF", codigo: "Y00115" },
  { formato: "12 onza", nombre: "CUERPO LATA MALTA LIGHT 355ML/12OZ", codigo: "Y00116" },
  { formato: "12 onza", nombre: "CUERPO LATA SEVEN UP ICE 2004, 12 ONZ", codigo: "Y00117" },
  { formato: "12 onza", nombre: "CUERPO LATA PEPSI TWIST 355 ML 12 OZ", codigo: "Y00121" },
  { formato: "8.4 onza", nombre: "CUERPO LATA SOLERA LIGHT 250ML/8.4OZ PP", codigo: "Y00124" },
  { formato: "10 onza", nombre: "CUERPO LATA ICE 295ML/10OZ", codigo: "Y00125" },
  { formato: "10 onza", nombre: "CUERPO LATA ICE 295ML/10OZ PL", codigo: "Y00126" },
  { formato: "10 onza", nombre: "CUERPO LATA PILSEN 295ML/10OZ", codigo: "Y00127" },
  { formato: "10 onza", nombre: "CUERPO LATA PILSEN 295ML/10OZ PL", codigo: "Y00128" },
  { formato: "10 onza", nombre: "CUERPO LATA LIGHT 295ML/10OZ", codigo: "Y00129" },
  { formato: "10 onza", nombre: "CUERPO LATA LIGHT 295ML/10OZ PL", codigo: "Y00130" },
  { formato: "10 onza", nombre: "CUERPO LATA SOLERA LIGHT 295ML/10OZ", codigo: "Y00131" },
  { formato: "10 onza", nombre: "CUERPO LATA SOLERA LIGHT 295ML/10OZ PL", codigo: "Y00132" },
  { formato: "10 onza", nombre: "CUERPO LATA SOLERA 295ML/10OZ", codigo: "Y00133" },
  { formato: "10 onza", nombre: "CUERPO LATA SOLERA 295ML/10OZ PL", codigo: "Y00134" },
  { formato: "10 onza", nombre: "CUERPO LATA PILSEN 295ML/10OZ  ZF SE", codigo: "Y00135" },
  { formato: "10 onza", nombre: "CUERPO LATA PILSEN 295ML/10OZ  ZF PP", codigo: "Y00136" },
  { formato: "10 onza", nombre: "CUERPO LATA ICE 295ML/10OZ  ZF SE", codigo: "Y00137" },
  { formato: "10 onza", nombre: "CUERPO LATA ICE 295ML/10OZ  ZF PP", codigo: "Y00138" },
  { formato: "10 onza", nombre: "CUERPO LATA LIGHT 295ML/10OZ  ZF SE", codigo: "Y00141" },
  { formato: "10 onza", nombre: "CUERPO LATA LIGHT 295ML/10OZ  ZF PP", codigo: "Y00142" },
  { formato: "10 onza", nombre: "CUERPO LATA MALTIN 295ML/10OZ EXP PTR", codigo: "Y00143" },
  { formato: "8.0 onza", nombre: "CUERPO LATA PILSEN  8OZ EXP SURINAM", codigo: "Y00144" },
  { formato: "12 onza", nombre: "CUERPO LATA GOLDEN NARAMANGO 355 ML 12 O", codigo: "Y00145" },
  { formato: "12 onza", nombre: "CUERPO LATA 7UP BITE 355 ML 12 OZ", codigo: "Y00149" },
  { formato: "12 onza", nombre: "CUERPO LATA PEPSI FREE 355 ML 12 OZ", codigo: "Y00150" },
  { formato: "12 onza", nombre: "CUERPO LATA TE DURAZNO LIPTON 355ML/12OZ", codigo: "Y00151" },
  { formato: "12 onza", nombre: "CUERPO LATA TE LIMON LIPTON 355ML/12OZ", codigo: "Y00152" },
  { formato: "8.4 onza", nombre: "CUERPO LATA MALTIN LIGHT 250ML/8.4OZ", codigo: "Y00155" },
  { formato: "12 onza", nombre: "CUERPO LATA MALTIN  355ML/12OZ EXP PTR", codigo: "Y00156" },
  { formato: "8.4 onza", nombre: "CUERPO LATA MALTIN 250ML/8.4OZ EXP COL", codigo: "Y00163" },
  { formato: "8.4 onza", nombre: "CUERPO LATA MALTIN SABOR 1 250ML/8.4OZ", codigo: "Y00165" },
  { formato: "8.4 onza", nombre: "CUERPO LATA MALTIN SABOR 2 250ML/8.4OZ", codigo: "Y00166" },
  { formato: "8.4 onza", nombre: "CUERPO LATA MALT SABOR 2 250ML EXP PRO", codigo: "Y00167" },
  { formato: "8.4 onza", nombre: "CUERPO LATA MALT SABOR 2 250ML EXP AUA", codigo: "Y00168" },
  { formato: "8.4 onza", nombre: "CUERPO LATA MALT SABOR 2 250ML EXP CZO", codigo: "Y00169" },
  { formato: "8.4 onza", nombre: "CUERPO LATA MALT SABOR 1 250ML EXP USA", codigo: "Y00170" },
  { formato: "10 onza", nombre: "CUERPO LATA SOLERA 295ML/10OZ  ZF SE", codigo: "Y00171" },
  { formato: "10 onza", nombre: "CUERPO LATA SOLERA 295ML/10OZ  ZF PP", codigo: "Y00172" },
  { formato: "10 onza", nombre: "CUERPO LATA SOLERA LIGHT 295ML/10OZ  SE", codigo: "Y00173" },
  { formato: "10 onza", nombre: "CUERPO LATA SOLERA LIGHT 295ML/10OZ  PP", codigo: "Y00174" },
  { formato: "10 onza", nombre: "CUERPO LATA PLAIN 295ML/10OZ", codigo: "Y00175" },
  { formato: "10 onza Sleek", nombre: "CUERPO LATA PEPSI 320ML 10,8 OZ", codigo: "Y00176" },
  { formato: "12 onza", nombre: "CUERPO LATA AGUA POTABLE 355ML/12OZ", codigo: "Y00177" },
  { formato: "10 onza", nombre: "CUERPO LATA ICE 295ML/10OZ  EXP PTR", codigo: "Y00178" },
  { formato: "10 onza", nombre: "CUERPO LATA MARGARITA 295ML/10OZ", codigo: "Y00179" },
  { formato: "12 onza", nombre: "CUERPO LATA MALTIN  355ML/12OZ ESPAÑA", codigo: "Y00180" },
  { formato: "8.4 onza", nombre: "CUERPO LATA ICE 250ML/8.4OZ EXPORT T-202", codigo: "Y00190" },
  { formato: "12 onza", nombre: "CUERPO LATA ICE 355ML/12OZ T-202", codigo: "Y00191" },
  { formato: "10 onza", nombre: "CUERPO LATA ICE 295ML/10OZ T-202", codigo: "Y00192" },
  { formato: "10 onza", nombre: "CUERPO LATA ICE 295ML/10OZ PL T-202", codigo: "Y00193" },
  { formato: "10 onza", nombre: "CUERPO LATA ICE 295ML/10OZ  ZF SE T-202", codigo: "Y00194" },
  { formato: "10 onza", nombre: "CUERPO LATA ICE 295ML/10OZ ZF PP T-202", codigo: "Y00195" },
  { formato: "8.4 onza", nombre: "CUERPO LATA ICE 250ML/8.4OZ EX COL T-202", codigo: "Y00196" },
  { formato: "10 onza", nombre: "CUERPO LATA LIGHT 295ML/10OZ T-202", codigo: "Y00197" },
  { formato: "10 onza", nombre: "CUERPO LATA LIGHT 295ML/10OZ PL T-202", codigo: "Y00198" },
  { formato: "10 onza", nombre: "CUERPO LATA LIGHT 295ML/10OZ  ZF SE T202", codigo: "Y00199" },
  { formato: "10 onza", nombre: "CUERPO LATA LIGHT 295ML/10OZ ZF PP T202", codigo: "Y00200" },
  { formato: "12 onza", nombre: "CUERPO LATA MALTIN  355ML/12OZ T-202", codigo: "Y00201" },
  { formato: "12 onza", nombre: "CUERPO LATA MALTIN  355ML/12OZ CAR T-202", codigo: "Y00202" },
  { formato: "8.4 onza", nombre: "CUERPO LATA MALTIN 250ML/8.4OZ T-202", codigo: "y00203" },
  { formato: "12 onza", nombre: "CUERPO LATA MALTIN 355/120Z TFBI T202", codigo: "Y00204" },
  { formato: "8.4 onza", nombre: "CUERPO LATA MALTIN LIGHT 250ML/8.4OZ 202", codigo: "Y00205" },
  { formato: "12 onza", nombre: "CUERPO LATA MALTA LIGHT 355ML/12OZ T202", codigo: "Y00206" },
  { formato: "12 onza", nombre: "CUERPO LATA PILSEN 355ML/12OZ T-202", codigo: "Y00207" },
  { formato: "12 onza", nombre: "CUERPO LATA PILSEN  355ML/12OZ PL T-202", codigo: "Y00208" },
  { formato: "8.4 onza", nombre: "CUERPO LATA PILSEN 8.45 OZ EXP T-202", codigo: "Y00209" },
  { formato: "8.4 onza", nombre: "CUERPO LATA PILSEN 250ML/8.4OZ COL T-202", codigo: "Y00210" },
  { formato: "8.0 onza", nombre: "CUERPO LATA PILSEN  8OZ EXP SURINAM 202", codigo: "Y00211" },
  { formato: "10 onza", nombre: "CUERPO LATA PILSEN 295ML/10OZ T-202", codigo: "Y00212" },
  { formato: "10 onza", nombre: "CUERPO LATA PILSEN 295ML/10OZ PL T-202", codigo: "Y00213" },
  { formato: "10 onza", nombre: "CUERPO LATA PILSEN 295ML/10OZ  ZF SE 202", codigo: "Y00214" },
  { formato: "10 onza", nombre: "CUERPO LATA PILSEN 295ML/10OZ ZF PP 202", codigo: "Y00215" },
  { formato: "10 onza", nombre: "CUERPO LATA SOLERA 295ML/10OZ T-202", codigo: "Y00216" },
  { formato: "10 onza", nombre: "CUERPO LATA SOLERA 295ML/10OZ PL T-202", codigo: "Y00217" },
  { formato: "10 onza", nombre: "CUERPO LATA SOLERA 295ML/10OZ  ZF SE 202", codigo: "Y00218" },
  { formato: "10 onza", nombre: "CUERPO LATA SOLERA 295ML/10OZ  ZF PP 202", codigo: "Y00219" },
  { formato: "10 onza", nombre: "CUERPO LATA SOLERA LIGHT 295ML/10OZ T202", codigo: "Y00220" },
  { formato: "10 onza", nombre: "CUERPO LATA SOL LIGHT 295ML/10OZ PL T202", codigo: "Y00221" },
  { formato: "10 onza", nombre: "CUERPO LATA SOL LIGHT 295ML/10OZ  SE 202", codigo: "Y00222" },
  { formato: "10 onza", nombre: "CUERPO LATA SOL LIGHT 295ML/10OZ  PP 202", codigo: "Y00223" },
  { formato: "12 onza", nombre: "CUERPO LATA PILSEN  355ML/12OZ PANAMA", codigo: "Y00224" },
  { formato: "12 onza", nombre: "CUERPO LATA EVERVESS KEN 355 ML 12 OZ", codigo: "Y00235" },
  { formato: "12 onza", nombre: "CUERPO LATA EVERVESS LII 355 ML 12 OZ", codigo: "Y00236" },
  { formato: "12 onza", nombre: "CUERPO LATA GOLDEN BLEND 355 ML 12 OZ", codigo: "Y00237" },
  { formato: "12 onza", nombre: "CUERPO LATA MANGO LIPTON 335 ML 12 OZ", codigo: "Y00238" },
  { formato: "12 onza", nombre: "CUERPO LATA PILSEN  355ML/12OZ PAN T-202", codigo: "Y00239" },
  { formato: "12 onza", nombre: "CUERPO LATA PILSEN  355ML/12OZ T-202 DF", codigo: "Y00240" },
  { formato: "12 onza", nombre: "CUERPO LATA MALTIN  355ML/12OZ ESP T-202", codigo: "Y00241" },
  { formato: "8.4 onza", nombre: "CUERPO LATA LIGHT 250ML/8.4OZ T-202", codigo: "Y00242" },
  { formato: "8.0 onza", nombre: "CUERPO LATA PILSEN 8OZ EXP USA T-202", codigo: "Y00243" },
  { formato: "10 onza", nombre: "CUERPO LATA SOLERA 295ML/10OZ PL/ZF T202", codigo: "Y00248" },
  { formato: "10 onza", nombre: "CUERPO LATA ICE 295ML/10OZ PL/ZF T-202", codigo: "Y00250" },
  { formato: "10 onza", nombre: "CUERPO LATA LIGHT 295ML/10OZ PL/ZF T-202", codigo: "Y00251" },
  { formato: "10 onza", nombre: "CUERPO LATA PILSEN 295ML/10OZ PL/ZF T202", codigo: "Y00252" },
  { formato: "10 onza", nombre: "CUERPO LATA SOL LIG 295ML/10OZ PL/ZF 202", codigo: "Y00253" },
  { formato: "12 onza", nombre: "CUERPO LATA 7UP 355 ML 12 OZ SUCRALOSA", codigo: "Y00264" },
  { formato: "10 onza", nombre: "CUERPO LATA MALTIN LIGHT 295ML/10OZ T202", codigo: "Y00268" },
  { formato: "10 onza", nombre: "CUERPO LATA SOLERA CLASSIC 295/10 T-202", codigo: "Y00271" },
  { formato: "10 onza", nombre: "CUERPO LATA SOLERA CLASSIC 295/10 PL/ZF", codigo: "Y00272" },
  { formato: "10 onza", nombre: "CUERPO LATA MALTIN MANTEKADO 295ML/10OZ", codigo: "Y00277" },
  { formato: "10 onza", nombre: "CUERPO LATA MALTIN CHOKOLATE 295ML/10OZ", codigo: "Y00278" },
  { formato: "12 onza", nombre: "CUERPO LATA PLAIN 355ML/12OZ", codigo: "Y00283" },
  { formato: "12 onza", nombre: "CUERPO LATA LIGHT 355ML/12OZ T-202", codigo: "Y00286" },
  { formato: "12 onza", nombre: "CUERPO LATA TE VERDE 355ML/12OZ T-202", codigo: "Y00288" },
  { formato: "10 onza", nombre: "CUERPO LATA PLAIN2 295ML/10OZ T-202", codigo: "Y00289" },
  { formato: "10 onza", nombre: "CUERPO LATA PLAIN3 295ML/10OZ T-202", codigo: "Y00290" },
  { formato: "12 onza Sleek", nombre: "CUERPO LATA PLAIN SLEEK 12OZ", codigo: "Y00294" },
  { formato: "12 onza", nombre: "CUERPO LATA PEPSI MAX 355 ML 12 OZ", codigo: "Y00297" },
  { formato: "12 onza", nombre: "CUERPO LATA GOLDEN CHICLE 355 ML", codigo: "Y00302" },
  { formato: "10 onza Sleek", nombre: "CUERPO LATA SEVEN UP 320ML 10,8 OZ", codigo: "Y00308" },
  { formato: "12 onza", nombre: "CUERPO LATA GOLDEN NARAPARCHITA 355ML 12", codigo: "Y00311" },
  { formato: "12 onza", nombre: "CUERPO LATA MALTIN 355ML/12OZ TFBI T202", codigo: "Y00312" },
  { formato: "12 onza", nombre: "CUERPO LATA ISLAND COASTAL LEMON 355/120", codigo: "Y00313" },
  { formato: "12 onza", nombre: "CUERPO LATA POLAR PILSEN 355/120Z TFBI T", codigo: "Y00314" },
  { formato: "12 onza", nombre: "CUERPO LATA ISLAND COASTAL SOUT 355/120Z", codigo: "Y00315" },
  { formato: "12 onza", nombre: "CUERPO LATA GINGER BEER BLOOD ORANGE 355", codigo: "Y00317" },
  { formato: "12 onza", nombre: "CUERPO LATA GINGER BEER ORIGINAL 355/120", codigo: "Y00318" },
  { formato: "12 onza", nombre: "CUERPO LATA ISLAND COASTAL LAGER 355/120", codigo: "Y00321" },
  { formato: "12 onza", nombre: "CUERPO LATA BEACH ME UP TFBI 355/120Z", codigo: "Y00324" },
  { formato: "12 onza Sleek", nombre: "CUERPO LATA ISLAND ACTIVE SLEEK 12OZ", codigo: "Y00333" },
  { formato: "12 onza", nombre: "CUERPO LATA MALTIN CHILE 355/12OZ", codigo: "Y00334" },
  { formato: "12 onza Sleek", nombre: "CUERPO LATA PILSEN SLEEK 355ML/12OZ", codigo: "Y00336" },
  { formato: "12 onza Sleek", nombre: "CUERPO LATA PILSEN SLEEK 355ML/12OZ PL", codigo: "Y00337" },
  { formato: "12 onza Sleek", nombre: "CUERPO LATA PILSEN SLEEK 355ML/12OZ ZF P", codigo: "Y00338" },
  { formato: "12 onza Sleek", nombre: "CUERPO LATA PILSEN SLEEK 355ML/12OZ SEU", codigo: "Y00339" },
  { formato: "12 onza Sleek", nombre: "CUERPO LATA LIGHT SLEEK 355ML/12OZ", codigo: "Y00340" },
  { formato: "12 onza Sleek", nombre: "CUERPO LATA LIGHT SLEEK 355ML/12OZ PL", codigo: "Y00341" },
  { formato: "12 onza Sleek", nombre: "CUERPO LATA LIGHT SLEEK 355ML/12OZ ZF PP", codigo: "Y00342" },
  { formato: "12 onza Sleek", nombre: "CUERPO LATA LIGHT SLEEK 355ML/12OZ SEU", codigo: "Y00343" },
  { formato: "12 onza Sleek", nombre: "CUERPO LATA MALTIN SLEEK 355ML/12OZ", codigo: "Y00344" },
  { formato: "12 onza Sleek", nombre: "CUERPO LATA MALTIN LIGHT SLEEK 355ML/12O", codigo: "Y00345" },
  { formato: "12 onza Sleek", nombre: "CUERPO LATA PEPSI SLEEK 355ML/12OZ", codigo: "Y00346" },
  { formato: "12 onza Sleek", nombre: "CUERPO LATA 7UP SLEEK 355ML/12OZ", codigo: "Y00348" },
  { formato: "8.4 onza", nombre: "CUERPO LATA CAROREÑA VERANO 250ML/8.4OZ", codigo: "Y00349" },
  { formato: "8.4 onza", nombre: "CUERPO LATA CAROREÑA VERANO PL 250ML/8.4", codigo: "Y00350" },
  { formato: "8.4 onza", nombre: "CUERPO LATA CAROREÑA VERANO ZF 250ML/8.4", codigo: "Y00351" },
  { formato: "8.4 onza", nombre: "CUERPO LATA CAROREÑA VERANO SEU 250ML/8.", codigo: "Y00352" },
  { formato: "12 onza Sleek", nombre: "CUERPO LATA SODA EVERVESS SLEEK 355ML 12", codigo: "Y00353" },
  { formato: "12 onza Sleek", nombre: "CUERPO LATA GOLDEN KOLA SLEEK 355ML 12", codigo: "Y00354" },
  { formato: "12 onza Sleek", nombre: "CUERPO LATA PEPSI LIGHT SLEEK 355ML/12OZ", codigo: "Y00355" },
  { formato: "12 onza Sleek", nombre: "CUERPO LATA PEPSI BLACK SLEEK 355ML/12OZ", codigo: "Y00358" },
  { formato: "12 onza Sleek", nombre: "CUERPO LATA MANGO YUKERY SLEEK 335ml/12Oz", codigo: "Y00359" },
  { formato: "12 onza Sleek", nombre: "CUERPO LATA MANZANA YUKERY SLEEK  335ml/12Oz", codigo: "Y00360" },
  { formato: "12 onza", nombre: "CUERPO LATA PERA YUKERY SLEEK 335ML/12OZ", codigo: "Y00361" },
  { formato: "12 onza Sleek", nombre: "CUERPO LATA DURAZNO YUKERY SLEEK 335ml/12Oz", codigo: "Y00362" },
  { formato: "8.4 onza", nombre: "CUERPO LATA CAROREÑA BLANCA 250ML/8,4OZ", codigo: "Y00363" },
  { formato: "8.4 onza", nombre: "CUERPO LATA CAROREÑA BLANCA PL 250ML/8,4", codigo: "Y00364" },
  { formato: "8.4 onza", nombre: "CUERPO LATA CAROREÑA BLANCA ZF 250ML/8,4", codigo: "Y00365" },
  { formato: "8.4 onza", nombre: "CUERPO LATA CAROREÑA BLANCA SEU 250ML/8,", codigo: "Y00366" },
  { formato: "12 onza Sleek", nombre: "CUERPO LATA PILSEN PROMO 7° SLEEK 355ML/", codigo: "Y00367" },
  { formato: "12 onza Sleek", nombre: "CUERPO LATA SODA AGUAKINA SLEEK 355ML/12", codigo: "Y00368" },
  { formato: "12 onza Sleek", nombre: "CUERPO LATA SODA SPARKLING SLEEK 355ML/1", codigo: "Y00369" },
  { formato: "12 onza Sleek", nombre: "CUERPO LATA TE LIMON LIPTON SLEEK 355ML/", codigo: "Y00370" },
  { formato: "12 onza Sleek", nombre: "CUERPO LATA TE DURAZNO LIPTON SLEEK 355M", codigo: "Y00371" },
  { formato: "12 onza Sleek", nombre: "CUERPO LATA ROCKSTAR SLEEK 355ML/12OZ", codigo: "Y00372" },
  { formato: "12 onza Sleek", nombre: "CUERPO LATA TE VERDE LIPTON SLEEK 355ML/", codigo: "Y00373" },
  { formato: "12 onza Sleek", nombre: "CUERPO LATA NARANJA YUKERY SLEEK  335ml/12Oz", codigo: "Y00374" },
  { formato: "8.4 onza", nombre: "CUERPO LATA CAROREÑA ROSADA 250ML/8,4OZ", codigo: "Y00375" },
  { formato: "8.4 onza", nombre: "CUERPO LATA CAROREÑA MOJITO 250ML/8,4OZ", codigo: "Y00376" },
  { formato: "12 onza Sleek", nombre: "CUERPO LATA CAROREÑA MOJITO 355ml/12oz", codigo: "Y00377" },
  { formato: "8.4 onza", nombre: "CUERPO LATA SOLERA KOLSCH 250ML/8,4OZ", codigo: "Y00378" },
  { formato: "8.4 onza", nombre: "CUERPO LATA LIGHT ZONAS ESP 250ML/8,4OZ", codigo: "Y00379" },
  { formato: "8.4 onza", nombre: "CUERPO LATA PILSEN ZONAS ESP 250ML/8,4OZ", codigo: "Y00380" },
  { formato: "8.4 onza", nombre: "CUERPO LATA SOLERA ZONAS ESP 250ML", codigo: "Y00381" },
  { formato: "8.4 onza", nombre: "CUERPO LATA SOLERA LIGHT ZONAS ESP 250ML", codigo: "Y00382" },
  { formato: "8.4 onza", nombre: "CUERPO LATA CAROREÑA VERANO ZONAS ESP 25", codigo: "Y00383" },
  { formato: "8.4 onza", nombre: "CUERPO LATA CAROREÑA BLANCA ZONAS ESP 25", codigo: "Y00384" },
  { formato: "12 onza Sleek", nombre: "CUERPO LATA GOLDEN MANZANA SLEEK 355ML/1", codigo: "Y00386" },
  { formato: "12 onza Sleek", nombre: "CUERPO LATA GOLDEN MANGO EXT SLEEK 355ML", codigo: "Y00387" },
  { formato: "12 onza Sleek", nombre: "CUERPO LATA GOLDEN PIÑA SLEEK 355ML/12OZ", codigo: "Y00388" },
  { formato: "12 onza Sleek", nombre: "CUERPO LATA GOLDEN UVA SLEEK 355ML/12OZ", codigo: "Y00389" },
  { formato: "12 onza Sleek", nombre: "CUERPO LATA GOLDEN NARANJA SLEEK 355ML/1", codigo: "Y00390" },
  { formato: "8.4 onza", nombre: "CUERPO LATA SOLERA BOHEMIA 250ML/8,4OZ", codigo: "Y00392" },
  { formato: "8.4 onza", nombre: "CUERPO LATA SOLERA BOHEMIA 250ML/8,4 PL", codigo: "Y00393" },
  { formato: "8.4 onza", nombre: "CUERPO LATA SOLERA BOHEMIA 250ML/8,4 ZF", codigo: "Y00394" },
  { formato: "8.4 onza", nombre: "CUERPO LATA LQM TINTA 250ML/8,4OZ", codigo: "Y00395" },
  { formato: "8.4 onza", nombre: "CUERPO LATA LQM BLANCA 250ML/8,4OZ", codigo: "Y00396" },
  { formato: "8.4 onza", nombre: "CUERPO LATA SOLERA 250ML ZONAS ESPECIALE", codigo: "Y00397" },
  { formato: "8.4 onza", nombre: "CUERPO LATA SOLERA LIGHT 250ML ZONAS ESP", codigo: "Y00398" },
  { formato: "12 onza Sleek", nombre: "CUERPO LATA GINGER BEER SLEEK 355ML/12OZ", codigo: "Y00399" },
  { formato: "8.4 onza", nombre: "CUERPO LATA PILSEN SLEEK 355ML/12OZ ZESP", codigo: "Y00400" },
  { formato: "8.4 onza", nombre: "CUERPO LATA PILSEN 250ML/8,4OZ ZONAS ESP", codigo: "Y00401" },
  { formato: "8.4 onza", nombre: "CUERPO LATA LIGHT 250ML/8,4OZ CORREDORES", codigo: "Y00402" },
  { formato: "8.4 onza", nombre: "CUERPO LATA LIGHT SLEEK 355ML/12OZ CORRE", codigo: "Y00403" },
  { formato: "12 onza Sleek", nombre: "CUERPO LATA PERA YUKERY SLEEK 335ml/12Oz", codigo: "Y00361" }
];

interface TabPBOProps {
  currentRole: 'public' | 'calidad' | 'logistica';
  onAuthenticate: (pin: string) => boolean;
  onLogout: () => void;
  cabeceraFecha?: string;
  cabeceraTurno?: number;
  cabeceraAnalista?: string;
}

export default function TabPBO({ 
  currentRole, 
  onAuthenticate, 
  onLogout,
  cabeceraFecha = '',
  cabeceraTurno = 1,
  cabeceraAnalista = ''
}: TabPBOProps) {
  // DB State
  const [lotes, setLotes] = useState<LotePBO[]>([]);
  const [paletas, setPaletas] = useState<Paleta[]>([]);
  const [reprocesos, setReprocesos] = useState<Reproceso[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // New Searchable SKU State
  const [showSkuDropdown, setShowSkuDropdown] = useState(false);
  const [skuSearchQuery, setSkuSearchQuery] = useState('');

  // Custom Delete Confirm ID
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // Reproceso form custom states (Images integration)
  const [selectedOriginalTickets, setSelectedOriginalTickets] = useState<string[]>([]);
  const [cantPaletasGen, setCantPaletasGen] = useState(1);
  const [cantCamadasGen, setCantCamadasGen] = useState(0);
  const [generatedTicketInputs, setGeneratedTicketInputs] = useState<string[]>([]);

  // Username registry identification
  const [usuarioRegistro, setUsuarioRegistro] = useState<string>(() => {
    return cabeceraAnalista || localStorage.getItem('usuario_registro_pbo') || 'OPERADOR';
  });

  // Sync analyst name when cabeceraAnalista changes
  useEffect(() => {
    if (cabeceraAnalista) {
      setUsuarioRegistro(cabeceraAnalista);
    }
  }, [cabeceraAnalista]);
  const [modalPaletas, setModalPaletas] = useState<{
    index: number;
    nro_ticket: string;
    nca: string;
    defecto: string;
    camadas_sueltas: number;
  }[]>([]);

  // Filter States
  const [filterDate, setFilterDate] = useState('');
  const [filterTurno, setFilterTurno] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [sidebarTab, setSidebarTab] = useState<'activos' | 'concluidos'>('activos');

  // Active PBO selection for details view / editing
  const [selectedLoteId, setSelectedLoteId] = useState<string | null>(null);
  
  // PBO Modals & Forms
  const [showNewLoteModal, setShowNewLoteModal] = useState(false);
  const [pboTabActive, setPboTabActive] = useState<'info' | 'paletas' | 'reproceso' | 'causas' | 'traslado'>('info');

  // Security Login state inside PBO if not authenticated
  const [pinInput, setPinInput] = useState('');
  const [authError, setAuthError] = useState(false);

  // New PBO Form
  const [newLote, setNewLote] = useState<{
    codigo_producto: string;
    producto: string;
    formato: string;
    lote: string;
    orden: string;
    fecha_produccion: string;
    defecto_general: string;
    paletas_count: number;
    camadas_sueltas: number;
    nca: string;
  }>({
    codigo_producto: '',
    producto: '',
    formato: '12 onza',
    lote: '',
    orden: '',
    fecha_produccion: '',
    defecto_general: '',
    paletas_count: 1,
    camadas_sueltas: 0,
    nca: '2.5'
  });

  // Reprocess form
  const [reproForm, setReproForm] = useState({
    tickets_originales_consumidos: '',
    nuevo_ticket_reprocesado: '',
    paletas_nuevas: 1,
    camadas_sueltas: 0,
    cantidad_unidades: 1,
  });

  const [editingRepro, setEditingRepro] = useState<Reproceso | null>(null);

  // Lab Dictamen Selection
  const [selectedReproId, setSelectedReproId] = useState<string | null>(null);
  const [dictamenEstatus, setDictamenEstatus] = useState<'Aprobado' | 'Rechazado'>('Aprobado');
  const [dictamenObs, setDictamenObs] = useState('');

  // Causes and actions state
  const [causesState, setCausesState] = useState({
    causas: '',
    medidas_correctivas: ''
  });

  // Search detail state
  const [searchDetailLote, setSearchDetailLote] = useState<LotePBO | null>(null);

  // Ref for canvas export
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Load all PBO data
  useEffect(() => {
    const loadPboData = async () => {
      setLoading(true);
      try {
        const l = await getLotesPBO();
        const p = await getPaletasPBO();
        const r = await getReprocesosPBO();
        setLotes(l);
        setPaletas(p);
        setReprocesos(r);
      } catch (err) {
        console.error("Error loading PBO data", err);
      } finally {
        setLoading(false);
      }
    };
    loadPboData();
  }, [refreshTrigger]);

  // Sync state when selected lote changes
  useEffect(() => {
    if (selectedLoteId) {
      const lote = lotes.find(l => l.id_pbo === selectedLoteId);
      if (lote) {
        setCausesState({
          causas: lote.causas || '',
          medidas_correctivas: lote.medidas_correctivas || ''
        });
      }
    }
    // Reset custom Reproceso form fields when switching lotes
    setSelectedOriginalTickets([]);
    setCantPaletasGen(1);
    setCantCamadasGen(0);
    setGeneratedTicketInputs([]);
  }, [selectedLoteId, lotes]);

  // Auto-complete default dates
  useEffect(() => {
    if (showNewLoteModal && !newLote.fecha_produccion) {
      const today = new Date().toISOString().split('T')[0];
      setNewLote(prev => ({ ...prev, fecha_produccion: today }));
    }
  }, [showNewLoteModal]);

  // Reset modalPaletas when closing modal
  useEffect(() => {
    if (!showNewLoteModal) {
      setModalPaletas([]);
    }
  }, [showNewLoteModal]);

  // Manual generation of paletas list based on user counts, defect, and NCA
  const handleGeneratePaletasList = () => {
    const count = newLote.paletas_count || 0;
    if (count <= 0 && newLote.camadas_sueltas <= 0) {
      alert("Por favor ingrese al menos 1 paleta completa o capas sueltas para generar el listado.");
      return;
    }
    const list = [];
    
    // Generate full pallets
    for (let i = 1; i <= count; i++) {
      list.push({
        index: i,
        nro_ticket: '', // MUST be blank initially as requested
        nca: newLote.nca,
        defecto: newLote.defecto_general || '',
        camadas_sueltas: 0
      });
    }
    
    // Generate 1 additional pallet if camadas_sueltas > 0 representing the loose layers
    if (newLote.camadas_sueltas > 0) {
      list.push({
        index: count + 1,
        nro_ticket: '', // MUST be blank initially as requested
        nca: newLote.nca,
        defecto: newLote.defecto_general || '',
        camadas_sueltas: newLote.camadas_sueltas
      });
    }
    
    setModalPaletas(list);
  };

  const handleAuthSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const ok = onAuthenticate(pinInput);
    if (ok) {
      setPinInput('');
      setAuthError(false);
    } else {
      setAuthError(true);
    }
  };

  // Calculations for Cans
  const getCansPerPallet = (formato: string) => {
    const f = formato.toLowerCase();
    if (f.includes('8.4') || f.includes('8.0') || f.includes('8')) return 9912;
    if (f.includes('10')) return 8024;
    return 7552; // 12 oz, etc.
  };

  const getCansPerCamada = () => 472;

  const calculateCans = (formato: string, paletasCount: number, camadasSueltas: number) => {
    const cansPerPallet = getCansPerPallet(formato);
    const cansPerCamada = getCansPerCamada();
    return (paletasCount * cansPerPallet) + (camadasSueltas * cansPerCamada);
  };

  // Handle Save Lote
  const handleCreateLote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (currentRole !== 'calidad') {
      alert("Acceso denegado: Solo Calidad puede ingresar retenciones PBO.");
      return;
    }

    if (!newLote.producto || !newLote.lote || !newLote.orden || !newLote.defecto_general) {
      alert("Por favor complete todos los campos obligatorios.");
      return;
    }

    if (modalPaletas.length === 0) {
      alert("Por favor, genere el listado de paletas primero usando el botón de 'Generar Listado de Paletas' y complete los números de ticket.");
      return;
    }

    const hasEmptyTicket = modalPaletas.some(p => !p.nro_ticket || !p.nro_ticket.trim());
    if (hasEmptyTicket) {
      alert("Por favor complete el número de ticket para todas las paletas generadas. Esta columna no puede quedar vacía.");
      return;
    }

    // Generate beautiful folio id: PBO-YYYYMMDD-###
    const cleanDate = newLote.fecha_produccion.replace(/-/g, '');
    const suffix = String(lotes.filter(l => l.fecha_produccion === newLote.fecha_produccion).length + 1).padStart(2, '0');
    const id_pbo = `PBO-${cleanDate}-${suffix}`;

    // Sum up total cans from customized pallet inputs
    let totalCans = 0;
    modalPaletas.forEach(mp => {
      if (mp.camadas_sueltas > 0) {
        totalCans += mp.camadas_sueltas * getCansPerCamada();
      } else {
        totalCans += getCansPerPallet(newLote.formato);
      }
    });

    const loteObj: LotePBO = {
      id_pbo,
      producto: newLote.producto.toUpperCase(),
      formato: newLote.formato,
      lote: newLote.lote.toUpperCase(),
      orden: newLote.orden,
      fecha_produccion: newLote.fecha_produccion,
      defecto_general: newLote.defecto_general,
      cantidad_total_latas: totalCans,
      ubicacion: 'Almacen de PBO',
      estatus_general: 'Abierto',
      usuario_registro: usuarioRegistro || 'CALIDAD (MÓDULO PBO)',
      creado_el: new Date().toISOString(),
      fecha_registro: cabeceraFecha || new Date().toISOString().split('T')[0],
      turno_registro: cabeceraTurno
    };

    // Generate Palets entries using dynamic inputs
    const paletasList: Paleta[] = modalPaletas.map(mp => ({
      id: `${id_pbo}-P${mp.index}`,
      id_pbo,
      nro_ticket: mp.nro_ticket.trim().toUpperCase(),
      camadas_sueltas: mp.camadas_sueltas,
      defecto: mp.defecto || newLote.defecto_general,
      nca: mp.nca !== undefined ? mp.nca : newLote.nca,
      estatus: 'Sin reprocesar',
      creado_el: new Date().toISOString()
    }));

    try {
      await saveLotePBO(loteObj);
      await savePaletasPBO(paletasList);
      
      setNewLote({
        codigo_producto: '',
        producto: '',
        formato: '12 onza',
        lote: '',
        orden: '',
        fecha_produccion: '',
        defecto_general: '',
        paletas_count: 1,
        camadas_sueltas: 0,
        nca: '2.5'
      });
      setShowNewLoteModal(false);
      setSelectedLoteId(id_pbo);
      setPboTabActive('paletas');
      setRefreshTrigger(p => p + 1);
      alert(`¡Folio ${id_pbo} creado con éxito con ${modalPaletas.length} paleta(s) bajo observación!`);
    } catch (err) {
      console.error(err);
      alert("Ocurrió un error al guardar el folio PBO.");
    }
  };

  // Handle Paleta Status Change
  const handlePaletaStatusChange = async (paleta: Paleta, newEstatus: string) => {
    if (paleta.estatus === 'Reprocesado' && newEstatus === 'Sin reprocesar') {
        const confirmMsg = "Advertencia: Cambiar el estatus de una paleta reprocesada a 'Sin reprocesar' eliminará el ticket de reproceso asociado y revertirá todas las paletas involucradas. ¿Desea continuar?";
        if (!window.confirm(confirmMsg)) return;

        const targetRepro = reprocesos.find(r => r.id_pbo === paleta.id_pbo && r.tickets_originales_consumidos.includes(paleta.nro_ticket));
        
        if (targetRepro) {
            const ticketsToRevert = targetRepro.tickets_originales_consumidos.split(',').map(t => t.trim().toUpperCase());
            
            const updatedPaletas = paletas.map(p2 => {
               if (p2.id_pbo === paleta.id_pbo && ticketsToRevert.includes(p2.nro_ticket.toUpperCase())) {
                   return { ...p2, estatus: 'Sin reprocesar' as any };
               }
               return p2;
            });
            
            setPaletas(updatedPaletas);
            
            try {
                await deleteReprocesoPBO(targetRepro.id);
                setReprocesos(prev => prev.filter(r => r.id !== targetRepro.id));
                alert("El ticket de reproceso asociado ha sido eliminado y las paletas revertidas a 'Sin reprocesar'. Recuerde hacer clic en 'Actualizar Datos Quirúrgicos' para guardar los cambios de las paletas.");
            } catch (e) {
                console.error(e);
            }
            return;
        }
    }
    
    // Normal change
    const updated = [...paletas];
    const pi = updated.findIndex(item => item.id === paleta.id);
    if (pi !== -1) {
        updated[pi].estatus = newEstatus as any;
        setPaletas(updated);
    }
  };

  // Mass save individual palets
  const handleUpdatePaletas = async (e: React.FormEvent) => {
    e.preventDefault();
    if (currentRole !== 'calidad') {
      alert("Acceso denegado: Solo Calidad puede actualizar datos técnicos.");
      return;
    }
    const lotePaletas = paletas.filter(p => p.id_pbo === selectedLoteId);
    try {
      await savePaletasPBO(lotePaletas);
      if (selectedLoteId) {
        await checkAndAutoCloseLote(selectedLoteId);
      }
      setRefreshTrigger(p => p + 1);
      alert("¡Paletas actualizadas quirúrgicamente con éxito!");
    } catch (err) {
      console.error(err);
      alert("Error al actualizar paletas.");
    }
  };

  // Add a pallet to an already existing PBO
  const handleAddPaleta = async (loteId: string, defectoGeneral: string) => {
    if (currentRole !== 'calidad') {
      alert("Acceso denegado: Solo Calidad puede agregar paletas.");
      return;
    }
    const lotePaletas = paletas.filter(p => p.id_pbo === loteId);
    const existingNum = lotePaletas.length + 1;
    const newPaletaId = `${loteId}-P${Date.now()}`;
    const newPaleta: Paleta = {
      id: newPaletaId,
      id_pbo: loteId,
      nro_ticket: `TKT-${loteId}-${existingNum}`,
      camadas_sueltas: 0,
      defecto: defectoGeneral || 'Defecto PBO',
      nca: '2.5',
      estatus: 'Sin reprocesar',
      creado_el: new Date().toISOString()
    };
    
    const updatedPaletas = [...paletas, newPaleta];
    setPaletas(updatedPaletas);
    try {
      await savePaletasPBO([newPaleta]);
      setRefreshTrigger(p => p + 1);
      alert(`¡Paleta agregada con éxito! Ticket sugerido: ${newPaleta.nro_ticket}`);
    } catch (err) {
      console.error(err);
      alert("Error al agregar la paleta.");
    }
  };

  // Remove a pallet from an existing PBO
  const handleRemovePaleta = async (paletaId: string, ticketNum: string) => {
    if (currentRole !== 'calidad') {
      alert("Acceso denegado: Solo Calidad puede eliminar paletas.");
      return;
    }
    if (!window.confirm(`¿Está seguro de eliminar la paleta con ticket "${ticketNum}"? Esta acción no se puede deshacer.`)) {
      return;
    }
    
    try {
      await deletePaletaPBO(paletaId);
      setPaletas(prev => prev.filter(p => p.id !== paletaId));
      if (selectedOriginalTickets.includes(ticketNum)) {
        setSelectedOriginalTickets(prev => prev.filter(t => t !== ticketNum));
      }
      setRefreshTrigger(p => p + 1);
      alert("Paleta eliminada con éxito.");
    } catch (err) {
      console.error(err);
      alert("Error al eliminar la paleta.");
    }
  };

  // Register reprocess
  const handleAddReproceso = async (e: React.FormEvent) => {
    e.preventDefault();
    if (currentRole !== 'calidad') {
      alert("Acceso denegado: Solo Calidad registra reprocesos.");
      return;
    }
    if (!selectedLoteId) return;

    if (!reproForm.nuevo_ticket_reprocesado) {
      alert("Debe indicar al menos un número de ticket.");
      return;
    }

    const inputTickets = reproForm.nuevo_ticket_reprocesado
      .split(/[\s,;\n]+/)
      .map(t => t.trim().toUpperCase())
      .filter(t => t.length > 0);

    if (inputTickets.length === 0) {
      alert("No se ingresaron números de ticket válidos.");
      return;
    }

    try {
      let updatedPaletas = [...paletas];
      const paletasToSaveList: Paleta[] = [];

      // 1. Update all selected original tickets to "Reprocesado" to discount them
      for (const tktOriginal of selectedOriginalTickets) {
        const existingPaletaIdx = updatedPaletas.findIndex(p => p.id_pbo === selectedLoteId && p.nro_ticket.toUpperCase() === tktOriginal.toUpperCase());
        if (existingPaletaIdx !== -1) {
          updatedPaletas[existingPaletaIdx] = {
            ...updatedPaletas[existingPaletaIdx],
            estatus: 'Reprocesado' as const
          };
          paletasToSaveList.push(updatedPaletas[existingPaletaIdx]);
        }
      }

      // 2. Save new reprocess outputs (new tickets generated)
      const consumedTicketsStr = selectedOriginalTickets.length > 0 
        ? selectedOriginalTickets.join(', ') 
        : (reproForm.tickets_originales_consumidos || 'N/A');

      const ticketsGeneradosStr = inputTickets.join(', ');
      const reproId = `REP-${Date.now()}`;
      const nuevoRep: Reproceso = {
        id: reproId,
        id_pbo: selectedLoteId,
        tickets_originales_consumidos: consumedTicketsStr,
        nuevo_ticket_reprocesado: ticketsGeneradosStr,
        camadas_sueltas: reproForm.camadas_sueltas || 0,
        paletas_nuevas: reproForm.paletas_nuevas || 0,
        estatus_calidad: 'Aprobado',
        estatus_logistica: 'Confirmado',
        usuario_registro: usuarioRegistro || 'CALIDAD (REPROCESO)',
        creado_el: new Date().toISOString(),
        fecha_registro: cabeceraFecha,
        turno_registro: cabeceraTurno
      };
      
      await saveReprocesoPBO(nuevoRep);

      if (paletasToSaveList.length > 0) {
        await savePaletasPBO(paletasToSaveList);
        setPaletas(updatedPaletas);
      }

      await checkAndAutoCloseLote(selectedLoteId);

      setReproForm({
        tickets_originales_consumidos: '',
        nuevo_ticket_reprocesado: '',
        paletas_nuevas: 1,
        camadas_sueltas: 0,
        cantidad_unidades: 1
      });
      setSelectedOriginalTickets([]);
      setRefreshTrigger(p => p + 1);
      alert(`¡Se registró el reproceso con éxito!`);
    } catch (err) {
      console.error(err);
      alert("Error al registrar reproceso.");
    }
  };

  const handleSaveEditedRepro = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingRepro) return;
    if (currentRole !== 'calidad') {
      alert("Acceso denegado: Solo Calidad puede modificar reprocesos.");
      return;
    }
    try {
      await saveReprocesoPBO(editingRepro);
      setEditingRepro(null);
      setRefreshTrigger(p => p + 1);
      alert("Reproceso actualizado con éxito.");
    } catch (err) {
      console.error(err);
      alert("Error al guardar cambios del reproceso.");
    }
  };

  const handleDeleteReproceso = async (repro: Reproceso) => {
    if (currentRole !== 'calidad') {
      alert("Acceso denegado: Solo Calidad puede eliminar reprocesos.");
      return;
    }
    if (!window.confirm(`¿Está seguro de eliminar este reproceso para el ticket ${repro.nuevo_ticket_reprocesado}?`)) {
      return;
    }
    try {
      await deleteReprocesoPBO(repro.id);
      
      // Reset the corresponding original paleta status back to "Sin reprocesar"
      const tkt = repro.nuevo_ticket_reprocesado.toUpperCase();
      const paletaObj = paletas.find(p => p.id_pbo === repro.id_pbo && p.nro_ticket.toUpperCase() === tkt);
      if (paletaObj) {
        const updatedPaleta = { ...paletaObj, estatus: 'Sin reprocesar' as const };
        await savePaletasPBO([updatedPaleta]);
        setPaletas(prev => prev.map(p => p.id === paletaObj.id ? updatedPaleta : p));
      }
      
      setRefreshTrigger(p => p + 1);
      alert("Reproceso eliminado con éxito. La paleta ha sido devuelta al estatus 'Sin reprocesar'.");
    } catch (err) {
      console.error(err);
      alert("Error al eliminar el reproceso.");
    }
  };


  // Logistics update stock movement
  const handleMoveUbicacion = async (ubicacion: string) => {
    if (currentRole !== 'logistica' && currentRole !== 'calidad') {
      alert("Acceso denegado: Solo personal autorizado puede mover mercancía.");
      return;
    }
    if (!selectedLoteId) return;

    const currentLote = lotes.find(l => l.id_pbo === selectedLoteId);
    if (!currentLote) return;

    const updated = {
      ...currentLote,
      ubicacion
    };

    try {
      await saveLotePBO(updated);
      setRefreshTrigger(p => p + 1);
      alert(`¡Ubicación física del lote actualizada a: ${ubicacion}!`);
    } catch (err) {
      console.error(err);
      alert("Error al reubicar.");
    }
  };

  // Logistics validate repro ticket
  const handleLogisticsValidateTicket = async (reproId: string, confirmStatus: 'Confirmado' | 'Inconsistencia') => {
    if (currentRole !== 'logistica' && currentRole !== 'calidad') {
      alert("Acceso denegado: Solo personal de Logística/Calidad puede validar tickets físicamente.");
      return;
    }

    const repro = reprocesos.find(r => r.id === reproId);
    if (!repro) return;

    const updated: Reproceso = {
      ...repro,
      estatus_logistica: confirmStatus
    };

    try {
      await saveReprocesoPBO(updated);
      await checkAndAutoCloseLote(repro.id_pbo);
      setRefreshTrigger(p => p + 1);
      alert(`Ticket físico marcado como: ${confirmStatus}`);
    } catch (err) {
      console.error(err);
    }
  };

  // Save technical causes & correctives
  const handleSaveCauses = async (e: React.FormEvent) => {
    e.preventDefault();
    if (currentRole !== 'calidad') {
      alert("Acceso denegado: Solo Calidad ingresa las causas de las desviaciones.");
      return;
    }
    if (!selectedLoteId) return;

    const currentLote = lotes.find(l => l.id_pbo === selectedLoteId);
    if (!currentLote) return;

    const updated: LotePBO = {
      ...currentLote,
      causas: causesState.causas,
      medidas_correctivas: causesState.medidas_correctivas
    };

    try {
      await saveLotePBO(updated);
      setRefreshTrigger(p => p + 1);
      alert("¡Investigación técnica guardada con éxito!");
    } catch (err) {
      console.error(err);
      alert("Error al guardar.");
    }
  };

  // Close PBO lot permanently
  const handleToggleCloseLote = async () => {
    if (currentRole !== 'calidad') {
      alert("Acceso denegado: Solo Calidad puede cerrar los expedientes PBO.");
      return;
    }
    if (!selectedLoteId) return;

    const currentLote = lotes.find(l => l.id_pbo === selectedLoteId);
    if (!currentLote) return;

    const isCurrentlyClosed = currentLote.estatus_general === 'Cerrado';
    const msg = isCurrentlyClosed 
      ? "¿Desea volver a ABRIR este expediente de Producto Bajo Observación?" 
      : "¿Está seguro de CERRAR este expediente? Al cerrarlo, certifica que todas las paletas han completado su ciclo físico y técnico.";

    const ok = window.confirm(msg);
    if (!ok) return;

    const updated: LotePBO = {
      ...currentLote,
      estatus_general: isCurrentlyClosed ? 'Abierto' : 'Cerrado'
    };

    try {
      await saveLotePBO(updated);
      setRefreshTrigger(p => p + 1);
      alert(`¡Expediente de PBO marcado como ${updated.estatus_general}!`);
    } catch (err) {
      console.error(err);
    }
  };

  // Automatic PBO closure check & update
  const checkAndAutoCloseLote = async (id: string) => {
    try {
      const latestPaletas = await getPaletasPBO();
      const latestLotes = await getLotesPBO();

      const lotObj = latestLotes.find(l => l.id_pbo === id);
      if (!lotObj) return;

      const lotPaletas = latestPaletas.filter(p => p.id_pbo === id);
      if (lotPaletas.length === 0) return;

      // Checks:
      // Any pallet is still "Sin reprocesar"
      const hasPendingPalets = lotPaletas.some(p => p.estatus === 'Sin reprocesar');

      const shouldClose = !hasPendingPalets;

      if (shouldClose && lotObj.estatus_general === 'Abierto') {
        const updatedLote: LotePBO = { ...lotObj, estatus_general: 'Cerrado' };
        await saveLotePBO(updatedLote);
        alert(`🎉 ¡Atención!\n\nSe ha completado el reproceso de todo el material del lote con folio "${id}". Todos los tickets pendientes han sido reprocesados exitosamente. El PBO ha sido culminado y archivado.`);
      } else if (!shouldClose && lotObj.estatus_general === 'Cerrado') {
        const updatedLote: LotePBO = { ...lotObj, estatus_general: 'Abierto' };
        await saveLotePBO(updatedLote);
      }
    } catch (e) {
      console.error("Error in checkAndAutoCloseLote", e);
    }
  };

  // Actual execute delete function called by our custom confirmation modal
  const executeDeleteLote = async (id: string) => {
    try {
      await deleteLotePBO(id);
      if (selectedLoteId === id) {
        setSelectedLoteId(null);
      }
      setDeleteConfirmId(null);
      setRefreshTrigger(p => p + 1);
      alert(`¡Expediente PBO ${id} eliminado satisfactoriamente!`);
    } catch (err) {
      console.error(err);
      alert("Ocurrió un error al intentar eliminar el expediente.");
    }
  };

  // Delete current selected PBO lot completely
  const handleDeleteLote = async () => {
    if (!selectedLoteId) return;
    setDeleteConfirmId(selectedLoteId);
  };

  // Autocomplete sample PBO data
  const handleLlenarDatosPboPrueba = async () => {
    if (currentRole !== 'calidad') {
      alert("Clave de seguridad requerida: Inicie sesión como Calidad para registrar datos de prueba.");
      return;
    }

    const cleanDate = new Date().toISOString().split('T')[0].replace(/-/g, '');
    const pboId = `PBO-${cleanDate}-99`;

    const sampleLote: LotePBO = {
      id_pbo: pboId,
      producto: 'PILSEN SLEEK 12 OZ',
      formato: '12 oz',
      lote: 'NR6J252A3',
      orden: '70161139',
      fecha_produccion: new Date().toISOString().split('T')[0],
      defecto_general: 'Decoración corrida y manchas de tinta en envoltura superior',
      cantidad_total_latas: calculateCans('12 oz', 4, 0),
      ubicacion: 'Transicion',
      estatus_general: 'Abierto',
      causas: 'Inundación temporal en el área de dosificación de tinta por vibración en booster de alimentación.',
      medidas_correctivas: 'Limpieza profunda de rodillos eyectores e incremento de frecuencia de purgado de inyectores.',
      usuario_registro: 'INSPECTOR CALIDAD PRUEBAS',
      creado_el: new Date().toISOString(),
      fecha_registro: cabeceraFecha || new Date().toISOString().split('T')[0],
      turno_registro: cabeceraTurno
    };

    const samplePalets: Paleta[] = [
      { id: `${pboId}-P1`, id_pbo: pboId, nro_ticket: `TKT-${cleanDate}-01`, camadas_sueltas: 0, defecto: 'Tinta corrida severa', nca: '4.0', estatus: 'Reprocesado', creado_el: new Date().toISOString() },
      { id: `${pboId}-P2`, id_pbo: pboId, nro_ticket: `TKT-${cleanDate}-02`, camadas_sueltas: 0, defecto: 'Tinta corrida moderada', nca: '2.5', estatus: 'Reprocesado', creado_el: new Date().toISOString() },
      { id: `${pboId}-P3`, id_pbo: pboId, nro_ticket: `TKT-${cleanDate}-03`, camadas_sueltas: 0, defecto: 'Puntos de tinta sutiles', nca: '1.5', estatus: 'Liberado Directo', creado_el: new Date().toISOString() },
      { id: `${pboId}-P4`, id_pbo: pboId, nro_ticket: `TKT-${cleanDate}-04`, camadas_sueltas: 0, defecto: 'Tinta corrida severa', nca: '4.0', estatus: 'Sin reprocesar', creado_el: new Date().toISOString() }
    ];

    const sampleRepros: Reproceso[] = [
      {
        id: `REP-${Date.now()}-1`,
        id_pbo: pboId,
        tickets_originales_consumidos: `TKT-${cleanDate}-01, TKT-${cleanDate}-02`,
        nuevo_ticket_reprocesado: `TKT-${cleanDate}-REWORK-A1`,
        camadas_sueltas: 0,
        estatus_calidad: 'Aprobado',
        estatus_logistica: 'Confirmado',
        usuario_registro: 'INSPECTOR CALIDAD PRUEBAS',
        creado_el: new Date().toISOString(),
        fecha_registro: cabeceraFecha,
        turno_registro: cabeceraTurno
      }
    ];

    try {
      await saveLotePBO(sampleLote);
      await savePaletasPBO(samplePalets);
      await saveReprocesoPBO(sampleRepros[0]);
      
      setSelectedLoteId(pboId);
      setPboTabActive('info');
      setRefreshTrigger(p => p + 1);
      alert("¡Integradas paletas, lotes, reprocesos e investigación de prueba para PBO! Revise el dashboard o busque por lote.");
    } catch (e) {
      console.error(e);
    }
  };

  // Filtering Logic
  const filteredLotes = lotes.filter(l => {
    const matchDate = !filterDate || l.fecha_produccion === filterDate;
    const matchTurno = !filterTurno || l.turno_registro === parseInt(filterTurno);
    
    const matchSearch = !searchTerm || 
      l.id_pbo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.lote.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.producto.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.orden.toLowerCase().includes(searchTerm.toLowerCase());

    return matchDate && matchTurno && matchSearch;
  });

  // Sorting: Abierto first, Cerrado at the end. For same status, newest first.
  const sortedFilteredLotes = [...filteredLotes].sort((a, b) => {
    if (a.estatus_general === 'Abierto' && b.estatus_general === 'Cerrado') return -1;
    if (a.estatus_general === 'Cerrado' && b.estatus_general === 'Abierto') return 1;
    return new Date(b.creado_el).getTime() - new Date(a.creado_el).getTime();
  });

  // KPI calculations
  const totalPBOActivos = lotes.filter(l => l.estatus_general === 'Abierto').length;
  
  const totalPaletasCuarentena = paletas.filter(p => p.estatus === 'Sin reprocesar' || p.estatus === 'En proceso').length;
  const totalPaletasPendientesReproceso = paletas.filter(p => p.estatus === 'Sin reprocesar').length;
  
  const totalCasosCerrados = lotes.filter(l => l.estatus_general === 'Cerrado').length;

  // Percentage recovery rate: Total APPROVED cans in Rework plus directly liberated cans vs Total registered cans
  // We calculate total registered cans
  const totalCansRegistered = lotes.reduce((acc, curr) => {
    const lotePalets = paletas.filter(p => p.id_pbo === curr.id_pbo);
    const sumCans = lotePalets.reduce((sum, p) => sum + (p.camadas_sueltas > 0 ? (p.camadas_sueltas * getCansPerCamada()) : getCansPerPallet(curr.formato)), 0);
    return acc + sumCans;
  }, 0);
  const totalLatasRetenidas = totalCansRegistered;
  
  // Liberated directly cans
  const totalCansLiberatedDirect = paletas
    .filter(p => p.estatus === 'Liberado Directo')
    .reduce((acc, curr) => {
      const parent = lotes.find(l => l.id_pbo === curr.id_pbo);
      if (!parent) return acc;
      if (curr.camadas_sueltas > 0) {
        return acc + (curr.camadas_sueltas * getCansPerCamada());
      }
      return acc + getCansPerPallet(parent.formato);
    }, 0);

  // Approved repro cans
  const totalCansApprovedRepro = reprocesos
    .filter(r => r.estatus_calidad === 'Aprobado')
    .reduce((acc, curr) => {
      const parent = lotes.find(l => l.id_pbo === curr.id_pbo);
      if (!parent) return acc;
      let cans = 0;
      if (curr.paletas_nuevas !== undefined && curr.paletas_nuevas > 0) {
        cans += curr.paletas_nuevas * getCansPerPallet(parent.formato);
      } else if (!curr.camadas_sueltas) {
        cans += getCansPerPallet(parent.formato);
      }
      if (curr.camadas_sueltas > 0) {
        cans += curr.camadas_sueltas * getCansPerCamada();
      }
      return acc + cans;
    }, 0);

  const totalCansLiberated = totalCansLiberatedDirect + totalCansApprovedRepro;
  const recoveryRate = totalCansRegistered > 0 
    ? Math.min(100, Math.round((totalCansLiberated / totalCansRegistered) * 100)) 
    : 0;

  // Search logic for express ticket inspection
  const handleExpressSearch = (term: string) => {
    setSearchTerm(term);
    if (!term) {
      setSearchDetailLote(null);
      return;
    }
    // Check if term is directly a ticket number
    const matchedPalet = paletas.find(p => p.nro_ticket.toLowerCase() === term.toLowerCase());
    if (matchedPalet) {
      const parentLote = lotes.find(l => l.id_pbo === matchedPalet.id_pbo);
      if (parentLote) {
        setSearchDetailLote(parentLote);
        setSelectedLoteId(parentLote.id_pbo);
        return;
      }
    }
    const matchedLoteObj = lotes.find(l => l.lote.toLowerCase() === term.toLowerCase() || l.id_pbo.toLowerCase() === term.toLowerCase());
    if (matchedLoteObj) {
      setSearchDetailLote(matchedLoteObj);
      setSelectedLoteId(matchedLoteObj.id_pbo);
    }
  };

  // Canvas Drawing for PBO Report
  const drawPboReportImage = () => {
    const canvas = canvasRef.current;
    if (!canvas || !selectedLoteId) return;

    const loteObj = lotes.find(l => l.id_pbo === selectedLoteId);
    if (!loteObj) return;

    const lotePaletas = paletas.filter(p => p.id_pbo === selectedLoteId);
    const loteRepros = reprocesos.filter(r => r.id_pbo === selectedLoteId);

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // We will design a gorgeous high resolution report (width: 800px)
    // Dynamic height calculation
    const headerHeight = 140;
    const detailHeight = 220;
    const palTableHeight = 40 + (lotePaletas.length * 30) + 20;
    const reproTableHeight = loteRepros.length > 0 ? (40 + (loteRepros.length * 30) + 20) : 0;
    const notesHeight = 140;
    const totalHeight = headerHeight + detailHeight + palTableHeight + reproTableHeight + notesHeight + 80;

    canvas.width = 800;
    canvas.height = totalHeight;

    // Background Gradient Slate
    ctx.fillStyle = '#f8fafc';
    ctx.fillRect(0, 0, 800, totalHeight);

    // Header Background
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(0, 0, 800, headerHeight);

    // Decorative Orange Strip (Polar Style)
    ctx.fillStyle = '#ea580c';
    ctx.fillRect(0, headerHeight - 8, 800, 8);

    // Title
    ctx.fillStyle = '#ffffff';
    ctx.font = '900 24px Inter, sans-serif';
    ctx.fillText('Polar - Reporte de Producto Bajo Observación', 40, 50);

    ctx.fillStyle = '#94a3b8';
    ctx.font = 'bold 12px "JetBrains Mono", monospace';
    ctx.fillText(`CÓDIGO FOLIO: ${loteObj.id_pbo}`, 40, 75);
    ctx.fillText(`IMPRESO EL: ${new Date().toLocaleString()}`, 40, 95);

    // Status Badge
    ctx.fillStyle = loteObj.estatus_general === 'Abierto' ? '#ef4444' : '#10b981';
    ctx.fillRect(620, 35, 140, 30);
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 11px Inter, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(loteObj.estatus_general === 'Abierto' ? '🔴 EN CUARENTENA' : '🟢 LIBERADO / CERRADO', 690, 54);
    ctx.textAlign = 'left';

    let currentY = headerHeight + 30;

    // Section: Datos Generales
    ctx.fillStyle = '#1e293b';
    ctx.font = 'bold 14px Inter, sans-serif';
    ctx.fillText('1. DATOS GENERALES DEL LOTE', 40, currentY);
    ctx.lineWidth = 1;
    ctx.strokeStyle = '#cbd5e1';
    ctx.beginPath();
    ctx.moveTo(40, currentY + 8);
    ctx.lineTo(760, currentY + 8);
    ctx.stroke();

    currentY += 30;

    // Details Grid Layout
    const lotePaletsForDraw = paletas.filter(p => p.id_pbo === loteObj.id_pbo);
    const totalCansOfLoteForDraw = lotePaletsForDraw.reduce((sum, p) => sum + (p.camadas_sueltas > 0 ? (p.camadas_sueltas * getCansPerCamada()) : getCansPerPallet(loteObj.formato)), 0);

    const details = [
      { label: 'PRODUCTO:', val: loteObj.producto },
      { label: 'LOTE DE ENVASE:', val: loteObj.lote },
      { label: 'ORDEN FABRICACIÓN:', val: loteObj.orden },
      { label: 'PRESENTACIÓN:', val: loteObj.formato },
      { label: 'FECHA DE FABRICACIÓN:', val: loteObj.fecha_produccion },
      { label: 'CANTIDAD (LATAS):', val: totalCansOfLoteForDraw.toLocaleString() },
      { label: 'ALMACÉN ACTUAL:', val: loteObj.ubicacion.toUpperCase() },
      { label: 'REGISTRADO POR:', val: loteObj.usuario_registro }
    ];

    ctx.font = 'bold 11px Inter, sans-serif';
    ctx.fillStyle = '#64748b';
    
    details.forEach((det, index) => {
      const col = index % 2; // 0 or 1
      const row = Math.floor(index / 2);
      const x = col === 0 ? 50 : 420;
      const y = currentY + (row * 35);

      ctx.fillStyle = '#64748b';
      ctx.font = 'bold 10px Inter, sans-serif';
      ctx.fillText(det.label, x, y);

      ctx.fillStyle = '#0f172a';
      ctx.font = 'bold 12px "JetBrains Mono", monospace';
      ctx.fillText(det.val, x, y + 16);
    });

    currentY += 160;

    // Section: Paletas Retenidas
    ctx.fillStyle = '#1e293b';
    ctx.font = 'bold 14px Inter, sans-serif';
    ctx.fillText('2. DETALLE DE PALETAS RETENIDAS', 40, currentY);
    ctx.beginPath();
    ctx.moveTo(40, currentY + 8);
    ctx.lineTo(760, currentY + 8);
    ctx.stroke();

    currentY += 25;

    // Draw Table Header
    ctx.fillStyle = '#e2e8f0';
    ctx.fillRect(40, currentY, 720, 26);

    ctx.fillStyle = '#334155';
    ctx.font = 'bold 10px Inter, sans-serif';
    ctx.fillText('ID PALETA', 50, currentY + 17);
    ctx.fillText('TICKET FÍSICO', 180, currentY + 17);
    ctx.fillText('CAMADAS', 330, currentY + 17);
    ctx.fillText('NCA', 420, currentY + 17);
    ctx.fillText('DEFECTO ASOCIADO', 500, currentY + 17);
    ctx.fillText('ESTADO', 680, currentY + 17);

    currentY += 26;

    // Draw Rows
    ctx.font = '11px "JetBrains Mono", monospace';
    lotePaletas.forEach((pal, idx) => {
      // Row zebra background
      ctx.fillStyle = idx % 2 === 0 ? '#ffffff' : '#f1f5f9';
      ctx.fillRect(40, currentY, 720, 26);

      ctx.fillStyle = '#1e293b';
      ctx.fillText(pal.id, 50, currentY + 17);
      ctx.fillText(pal.nro_ticket, 180, currentY + 17);
      ctx.fillText(pal.camadas_sueltas === 0 ? 'Completa' : `${pal.camadas_sueltas} Cam`, 330, currentY + 17);
      ctx.fillText(`${pal.nca}%`, 420, currentY + 17);
      ctx.fillText(pal.defecto.substring(0, 22) + (pal.defecto.length > 22 ? '...' : ''), 500, currentY + 17);
      
      // Status Badge color
      if (pal.estatus === 'Liberado Directo') ctx.fillStyle = '#10b981';
      else if (pal.estatus === 'Reprocesado') ctx.fillStyle = '#6366f1';
      else if (pal.estatus === 'Desecho') ctx.fillStyle = '#ef4444';
      else ctx.fillStyle = '#f59e0b';
      
      ctx.fillRect(675, currentY + 5, 80, 16);
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 8px Inter, sans-serif';
      ctx.fillText(pal.estatus.toUpperCase(), 680, currentY + 16);
      ctx.font = '11px "JetBrains Mono", monospace';

      currentY += 26;
    });

    // Draw Reprocess Table if exists
    if (loteRepros.length > 0) {
      currentY += 20;
      ctx.fillStyle = '#1e293b';
      ctx.font = 'bold 14px Inter, sans-serif';
      ctx.fillText('3. HISTORIAL DE REPROCESOS / REWORK', 40, currentY);
      ctx.beginPath();
      ctx.moveTo(40, currentY + 8);
      ctx.lineTo(760, currentY + 8);
      ctx.stroke();

      currentY += 25;

      ctx.fillStyle = '#e2e8f0';
      ctx.fillRect(40, currentY, 720, 26);

      ctx.fillStyle = '#334155';
      ctx.font = 'bold 10px Inter, sans-serif';
      ctx.fillText('TICKETS CONSUMIDOS', 50, currentY + 17);
      ctx.fillText('NUEVO TICKET', 250, currentY + 17);
      ctx.fillText('DICTAMEN CALIDAD', 420, currentY + 17);
      ctx.fillText('ESTADO LOGÍSTICA', 600, currentY + 17);

      currentY += 26;

      ctx.font = '11px "JetBrains Mono", monospace';
      loteRepros.forEach((rep, idx) => {
        ctx.fillStyle = idx % 2 === 0 ? '#ffffff' : '#f1f5f9';
        ctx.fillRect(40, currentY, 720, 26);

        ctx.fillStyle = '#1e293b';
        ctx.fillText(rep.tickets_originales_consumidos.substring(0, 28) + (rep.tickets_originales_consumidos.length > 28 ? '...' : ''), 50, currentY + 17);
        ctx.fillText(rep.nuevo_ticket_reprocesado, 250, currentY + 17);
        
        ctx.font = 'bold 10px Inter, sans-serif';
        if (rep.estatus_calidad === 'Aprobado') {
          ctx.fillStyle = '#10b981';
          ctx.fillText('✅ APROBADO', 420, currentY + 17);
        } else if (rep.estatus_calidad === 'Rechazado') {
          ctx.fillStyle = '#ef4444';
          ctx.fillText('❌ RECHAZADO', 420, currentY + 17);
        } else {
          ctx.fillStyle = '#f59e0b';
          ctx.fillText('⏳ BAJO ANALISIS', 420, currentY + 17);
        }

        if (rep.estatus_logistica === 'Confirmado') {
          ctx.fillStyle = '#10b981';
          ctx.fillText('✔ CONCORDADO', 600, currentY + 17);
        } else if (rep.estatus_logistica === 'Inconsistencia') {
          ctx.fillStyle = '#ef4444';
          ctx.fillText('⚠ INCONSISTENCIA', 600, currentY + 17);
        } else {
          ctx.fillStyle = '#64748b';
          ctx.fillText('⏳ EN TRANSITO', 600, currentY + 17);
        }

        ctx.font = '11px "JetBrains Mono", monospace';
        currentY += 26;
      });
    }

    // Investigation block
    currentY += 20;
    ctx.fillStyle = '#1e293b';
    ctx.font = 'bold 14px Inter, sans-serif';
    ctx.fillText('4. INVESTIGACIÓN TÉCNICA Y ACCIONES', 40, currentY);
    ctx.beginPath();
    ctx.moveTo(40, currentY + 8);
    ctx.lineTo(760, currentY + 8);
    ctx.stroke();

    currentY += 25;

    ctx.fillStyle = '#ffffff';
    ctx.fillRect(40, currentY, 720, 100);
    ctx.strokeStyle = '#cbd5e1';
    ctx.strokeRect(40, currentY, 720, 100);

    ctx.fillStyle = '#64748b';
    ctx.font = 'bold 10px Inter, sans-serif';
    ctx.fillText('CAUSA RAÍZ DIAGNOSTICADA:', 55, currentY + 20);
    ctx.fillText('MEDIDAS CORRECTIVAS ADOPTADAS:', 55, currentY + 60);

    ctx.fillStyle = '#1e293b';
    ctx.font = '11px Inter, sans-serif';
    
    // Wrap text function for causes
    const cText = loteObj.causas || 'Sin registrar causa aún.';
    const aText = loteObj.medidas_correctivas || 'Sin registrar medidas correctivas aún.';
    
    ctx.fillText(cText.substring(0, 110) + (cText.length > 110 ? '...' : ''), 55, currentY + 36);
    ctx.fillText(aText.substring(0, 110) + (aText.length > 110 ? '...' : ''), 55, currentY + 76);

    // Trigger download
    const link = document.createElement('a');
    link.download = `PBO-Expediente-${loteObj.id_pbo}.png`;
    link.href = canvas.toDataURL();
    link.click();
  };

  return (
    <div className="space-y-6">
      
      {/* 1. TOP HEADER WITH SECURITY STATUS */}
      <div className="bg-slate-900 rounded-3xl p-6 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="bg-orange-600 p-3 rounded-2xl shadow-lg shadow-orange-500/20">
            <ShieldAlert className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-extrabold tracking-tight">Módulo Producto Bajo Observación (PBO)</h1>
            <p className="text-xs text-slate-400 mt-1">Control técnico, reproceso y dictámenes para mercancía retenida en envasado.</p>
          </div>
        </div>

        {/* Simplified Analista Identification */}
        <div className="flex items-center gap-3 bg-slate-800/80 border border-slate-700/60 p-3 rounded-2xl shrink-0">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-black uppercase text-slate-400 block">Analista:</span>
            <input
              type="text"
              value={usuarioRegistro}
              onChange={(e) => {
                const val = e.target.value;
                setUsuarioRegistro(val);
                localStorage.setItem('usuario_registro_pbo', val);
              }}
              placeholder="Ingrese su nombre..."
              className="bg-slate-950 border border-slate-700 rounded px-2.5 py-1 text-xs font-bold text-orange-400 uppercase focus:outline-hidden focus:ring-1 focus:ring-orange-500 w-36 sm:w-44"
            />
          </div>
        </div>
      </div>

      {/* 2. STATS KPI DASHBOARD */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        
        <div className="bg-white p-3 sm:p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between gap-2">
          <div>
            <span className="text-[9px] sm:text-[10px] font-bold text-slate-400 uppercase tracking-wider block">PBO abiertos</span>
            <span className="text-lg sm:text-2xl font-black text-slate-800 mt-1 block">{totalPBOActivos}</span>
            <span className="text-[9px] sm:text-[10px] text-red-500 font-semibold block mt-0.5 leading-tight">En cuarentena activa</span>
          </div>
          <div className="bg-red-50 p-2 sm:p-3 rounded-2xl text-red-600 shrink-0">
            <AlertOctagon className="w-4 h-4 sm:w-6 sm:h-6" />
          </div>
        </div>

        <div className="bg-white p-3 sm:p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between gap-2">
          <div>
            <span className="text-[9px] sm:text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Paletas Retenidas</span>
            <span className="text-lg sm:text-2xl font-black text-slate-800 mt-1 block">{totalPaletasCuarentena}</span>
            <span className="text-[9px] sm:text-[10px] text-amber-500 font-semibold block mt-0.5 leading-tight">Pendientes</span>
          </div>
          <div className="bg-amber-50 p-2 sm:p-3 rounded-2xl text-amber-500 shrink-0">
            <Layers className="w-4 h-4 sm:w-6 sm:h-6" />
          </div>
        </div>

        <div className="bg-white p-3 sm:p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between gap-2">
          <div>
            <span className="text-[9px] sm:text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Paletas por Reprocesar</span>
            <span className="text-lg sm:text-2xl font-black text-indigo-700 mt-1 block">{totalPaletasPendientesReproceso}</span>
            <span className="text-[9px] sm:text-[10px] text-emerald-600 font-semibold block mt-0.5 leading-tight">En espera</span>
          </div>
          <div className="bg-indigo-50 p-2 sm:p-3 rounded-2xl text-indigo-600 shrink-0">
            <TrendingUp className="w-4 h-4 sm:w-6 sm:h-6" />
          </div>
        </div>

        <div className="bg-white p-3 sm:p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between gap-2">
          <div>
            <span className="text-[9px] sm:text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Total Latas Retenidas</span>
            <span className="text-lg sm:text-2xl font-black text-slate-800 mt-1 block">{totalLatasRetenidas.toLocaleString()}</span>
            <span className="text-[9px] sm:text-[10px] text-emerald-500 font-semibold block mt-0.5 leading-tight">Total general</span>
          </div>
          <div className="bg-emerald-50 p-2 sm:p-3 rounded-2xl text-emerald-600 shrink-0">
            <CheckCircle className="w-4 h-4 sm:w-6 sm:h-6" />
          </div>
        </div>

      </div>

      {/* 3. EXPRESS FINDER / BÚSQUEDA DE EXPEDIENTES */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <h3 className="text-sm font-extrabold text-slate-800 mb-3 flex items-center gap-1.5 uppercase tracking-wider">
          <Barcode className="w-4 h-4 text-orange-600" /> Buscador de Expedientes de Calidad (Auditoría Express)
        </h3>
        <div className="relative">
          <input
            type="text"
            placeholder="Ingrese el número de lote (ej: NR6J252A3) o folio PBO (ej: PBO-20260707-01)..."
            value={searchTerm}
            onChange={(e) => handleExpressSearch(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 focus:border-orange-500 rounded-xl py-3 px-4 pl-11 text-sm text-slate-700 focus:outline-hidden focus:ring-1 focus:ring-orange-500 transition-all font-semibold"
          />
          <Search className="w-5 h-5 text-slate-400 absolute left-4 top-3.5" />
        </div>
        {searchDetailLote && (
          <div className="bg-orange-50/50 border border-orange-100 rounded-xl p-4 mt-3 flex items-center justify-between text-xs text-orange-800">
            <div>
              <span className="font-extrabold block">¡Expediente Coincidente Encontrado!</span>
              <span className="mt-0.5 block">
                Folio: <strong className="font-mono">{searchDetailLote.id_pbo}</strong> | Producto: <strong>{searchDetailLote.producto}</strong> | Ubicación: <strong className="uppercase">{searchDetailLote.ubicacion}</strong>
              </span>
            </div>
            <button
              onClick={() => {
                setSelectedLoteId(searchDetailLote.id_pbo);
                setSearchDetailLote(null);
                setSearchTerm('');
              }}
              className="bg-orange-600 hover:bg-orange-700 text-white font-extrabold px-3 py-1.5 rounded-lg transition-all"
            >
              Abrir Expediente
            </button>
          </div>
        )}
      </div>

      {/* 4. SECTIONS PANEL (Master list vs Detail) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* LEFT COLUMN: PBO LIST (5 cols) */}
        <div className={`lg:col-span-5 space-y-4 ${selectedLoteId ? 'hidden lg:block' : 'block'}`}>
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
            
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
              <h2 className="text-base font-extrabold text-slate-800 flex items-center gap-1.5">
                <ClipboardList className="w-5 h-5 text-indigo-600" /> PBO activos
              </h2>
              {currentRole === 'calidad' && (
                <button
                  onClick={() => setShowNewLoteModal(true)}
                  className="bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold px-3 py-2 rounded-xl transition-all flex items-center gap-1 cursor-pointer"
                >
                  <Plus className="w-4 h-4" /> Registrar Retención
                </button>
              )}
            </div>

            {/* Continuous filter controls */}
            <div className="grid grid-cols-2 gap-2 mb-4">
              <div>
                <label className="text-[10px] font-black uppercase text-slate-400 block mb-1">Filtrar Fecha</label>
                <input
                  type="date"
                  value={filterDate}
                  onChange={(e) => setFilterDate(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg text-xs p-2 text-slate-700 focus:outline-hidden"
                />
              </div>
              <div>
                <label className="text-[10px] font-black uppercase text-slate-400 block mb-1">Filtrar Turno</label>
                <select
                  value={filterTurno}
                  onChange={(e) => setFilterTurno(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg text-xs p-2 text-slate-700 focus:outline-hidden"
                >
                  <option value="">Todos</option>
                  <option value="1">Turno 1 (Día)</option>
                  <option value="2">Turno 2 (Tarde)</option>
                  <option value="3">Turno 3 (Noche)</option>
                </select>
              </div>
            </div>

            {/* Sub-tabs for Activos vs Concluidos */}
            <div className="flex border-b border-slate-200 mb-3 text-[11px] font-bold">
              <button
                type="button"
                onClick={() => setSidebarTab('activos')}
                className={`flex-1 py-2 text-center border-b-2 transition-all cursor-pointer ${
                  sidebarTab === 'activos'
                    ? 'border-orange-500 text-orange-600'
                    : 'border-transparent text-slate-400 hover:text-slate-600'
                }`}
              >
                PBO Activos ({lotes.filter(l => l.estatus_general === 'Abierto').length})
              </button>
              <button
                type="button"
                onClick={() => setSidebarTab('concluidos')}
                className={`flex-1 py-2 text-center border-b-2 transition-all cursor-pointer ${
                  sidebarTab === 'concluidos'
                    ? 'border-orange-500 text-orange-600'
                    : 'border-transparent text-slate-400 hover:text-slate-600'
                }`}
              >
                Concluidos ({lotes.filter(l => l.estatus_general === 'Cerrado').length})
              </button>
            </div>

            {/* List */}
            <div className="space-y-2.5 max-h-[480px] overflow-y-auto pr-1">
              {(() => {
                const filteredByTab = sortedFilteredLotes.filter(l => 
                  sidebarTab === 'activos' ? l.estatus_general === 'Abierto' : l.estatus_general === 'Cerrado'
                );

                if (filteredByTab.length === 0) {
                  return (
                    <div className="text-center py-10 text-slate-400 text-xs font-semibold">
                      Ningún expediente {sidebarTab === 'activos' ? 'activo' : 'concluido'} coincide con los criterios.
                    </div>
                  );
                }

                return filteredByTab.map(l => {
                  const isSelected = selectedLoteId === l.id_pbo;
                  return (
                    <div
                      key={l.id_pbo}
                      onClick={() => {
                        setSelectedLoteId(l.id_pbo);
                        setPboTabActive('info');
                      }}
                      className={`p-3.5 rounded-xl border transition-all cursor-pointer text-xs ${
                        isSelected 
                          ? 'border-orange-500 bg-orange-50/20 shadow-xs' 
                          : 'border-slate-200 bg-slate-50/50 hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-mono font-bold text-slate-900">{l.id_pbo}</span>
                        <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
                          <span className={`px-2 py-0.5 rounded-sm font-bold text-[9px] uppercase ${
                            l.estatus_general === 'Abierto' ? 'bg-red-100 text-red-800' : 'bg-emerald-100 text-emerald-800'
                          }`}>
                            {l.estatus_general}
                          </span>
                          <button
                            onClick={() => setDeleteConfirmId(l.id_pbo)}
                            className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-100 rounded transition-all cursor-pointer"
                            title="Eliminar Expediente"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                      <div className="mt-2 text-slate-700 font-bold">{l.producto}</div>
                      <div className="mt-1 flex items-center justify-between text-slate-400 text-[10px]">
                        <span>Lote: <strong className="font-mono text-slate-600">{l.lote}</strong></span>
                        <span>Ubicación: <strong className="text-orange-600 uppercase">{l.ubicacion}</strong></span>
                      </div>
                    </div>
                  );
                });
              })()}
            </div>

            {/* Test Seeder Button */}
            {currentRole === 'calidad' && (
              <button
                onClick={handleLlenarDatosPboPrueba}
                className="w-full mt-4 flex items-center justify-center gap-1.5 bg-indigo-50 border border-indigo-100 text-indigo-700 hover:bg-indigo-100 hover:border-indigo-200 transition-all text-xs font-bold py-2 rounded-xl cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-indigo-600 animate-bounce" />
                Registrar Lote de Prueba PBO
              </button>
            )}

          </div>
        </div>

        {/* RIGHT COLUMN: PBO EXPEDIENTE DETAIL (7 cols) */}
        <div className={`lg:col-span-7 ${!selectedLoteId ? 'hidden lg:block' : 'block'}`}>
          {!selectedLoteId ? (
            <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-xs text-center flex flex-col items-center justify-center min-h-[400px]">
              <Database className="w-12 h-12 text-slate-300 mb-3" />
              <h3 className="text-sm font-extrabold text-slate-700">Ningún Expediente Seleccionado</h3>
              <p className="text-xs text-slate-400 max-w-sm mt-1">
                Seleccione un folio PBO de la lista lateral o ingrese datos en la búsqueda para consultar o editar la trazabilidad de calidad.
              </p>
            </div>
          ) : (
            (() => {
              const activeLote = lotes.find(l => l.id_pbo === selectedLoteId);
              if (!activeLote) return null;

              const activeLotePaletas = paletas.filter(p => p.id_pbo === selectedLoteId);
              const activeLoteRepros = reprocesos.filter(r => r.id_pbo === selectedLoteId);

              return (
                <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-6">
                  {/* MOBILE BACK BUTTON */}
                  <div className="lg:hidden mb-2">
                    <button
                      onClick={() => setSelectedLoteId(null)}
                      className="flex items-center gap-1.5 text-xs font-black text-indigo-700 hover:text-indigo-800 bg-indigo-50/50 hover:bg-indigo-50 border border-indigo-100 px-3.5 py-2 rounded-xl transition-all cursor-pointer"
                    >
                      ← Volver a la Lista de PBO
                    </button>
                  </div>
                  {/* DETAIL HEADER */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-black text-slate-900 bg-slate-100 border border-slate-200 px-2.5 py-1 rounded-lg text-sm">{activeLote.id_pbo}</span>
                        <span className={`px-2 py-0.5 rounded-sm font-bold text-[10px] uppercase ${
                          activeLote.estatus_general === 'Abierto' ? 'bg-red-100 text-red-800' : 'bg-emerald-100 text-emerald-800'
                        }`}>
                          {activeLote.estatus_general}
                        </span>
                      </div>
                      <h2 className="text-base font-extrabold text-slate-800 mt-2">{activeLote.producto}</h2>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={drawPboReportImage}
                        className="flex items-center gap-1.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold px-3 py-2 rounded-xl transition-all cursor-pointer shadow-xs"
                      >
                        <Printer className="w-3.5 h-3.5" /> Descargar PNG
                      </button>

                      {activeLote.estatus_general !== 'Cerrado' && (
                        <button
                          onClick={() => setDeleteConfirmId(activeLote.id_pbo)}
                          className="flex items-center gap-1 bg-red-50 hover:bg-red-100 text-red-600 hover:text-red-700 text-xs font-bold px-3 py-2 rounded-xl border border-red-200 transition-all cursor-pointer shadow-xs"
                          title="Eliminar Expediente"
                        >
                          <Trash2 className="w-3.5 h-3.5" /> Eliminar PBO
                        </button>
                      )}
                    </div>
                  </div>

                  {activeLote.estatus_general === 'Cerrado' && (
                    <div className="bg-amber-50 border border-amber-200 text-amber-800 rounded-xl p-3.5 text-xs font-bold flex items-center gap-2.5 shadow-xs">
                      <Eye className="w-5 h-5 text-amber-600 shrink-0" />
                      <div>
                        <span className="block text-slate-800 uppercase tracking-wider font-extrabold text-[10px]">Expediente Culminado (Cerrado)</span>
                        <p className="font-medium text-[11px] text-amber-700 mt-0.5">Este PBO ha concluido todo su proceso técnico y físico. El sistema lo ha bloqueado en modo de <strong className="font-black text-amber-900">SOLO VISUALIZACIÓN</strong> para resguardar la trazabilidad.</p>
                      </div>
                    </div>
                  )}

                  {/* INTERNAL DETAIL NAV TABS */}
                  <div className="flex border-b border-slate-200 overflow-x-auto">
                    <button
                      onClick={() => setPboTabActive('info')}
                      className={`py-2 px-3.5 font-bold text-xs transition-all whitespace-nowrap border-b-2 cursor-pointer ${
                        pboTabActive === 'info' ? 'border-orange-500 text-orange-600' : 'border-transparent text-slate-400 hover:text-slate-700'
                      }`}
                    >
                      ℹ Datos del Expediente
                    </button>
                    <button
                      onClick={() => setPboTabActive('paletas')}
                      className={`py-2 px-3.5 font-bold text-xs transition-all whitespace-nowrap border-b-2 cursor-pointer ${
                        pboTabActive === 'paletas' ? 'border-orange-500 text-orange-600' : 'border-transparent text-slate-400 hover:text-slate-700'
                      }`}
                    >
                      🥞 Paletas Retenidas ({activeLotePaletas.length})
                    </button>
                    <button
                      onClick={() => setPboTabActive('reproceso')}
                      className={`py-2 px-3.5 font-bold text-xs transition-all whitespace-nowrap border-b-2 cursor-pointer ${
                        pboTabActive === 'reproceso' ? 'border-orange-500 text-orange-600' : 'border-transparent text-slate-400 hover:text-slate-700'
                      }`}
                    >
                      🔄 Reproceso ({activeLoteRepros.length})
                    </button>
                    <button
                      onClick={() => setPboTabActive('causas')}
                      className={`py-2 px-3.5 font-bold text-xs transition-all whitespace-nowrap border-b-2 cursor-pointer ${
                        pboTabActive === 'causas' ? 'border-orange-500 text-orange-600' : 'border-transparent text-slate-400 hover:text-slate-700'
                      }`}
                    >
                      🧪 Causa y Medidas
                    </button>
                  </div>

                  {/* ACTIVE TAB VIEWS */}
                  
                  {/* TAB 1: GENERAL INFO */}
                  {pboTabActive === 'info' && (() => {
                    const materialReprocesado = activeLotePaletas.filter(p => p.estatus === 'Reprocesado').reduce((acc, p) => acc + (p.camadas_sueltas > 0 ? (p.camadas_sueltas * getCansPerCamada()) : getCansPerPallet(activeLote.formato)), 0);
                    const materialSalidaReproceso = activeLoteRepros.reduce((acc, r) => acc + ((r.paletas_nuevas || 0) * getCansPerPallet(activeLote.formato)) + ((r.camadas_sueltas || 0) * getCansPerCamada()), 0);
                    const materialBriqueta = activeLotePaletas.filter(p => p.estatus === 'Briqueta' || p.estatus === 'Desecho').reduce((acc, p) => acc + (p.camadas_sueltas > 0 ? (p.camadas_sueltas * getCansPerCamada()) : getCansPerPallet(activeLote.formato)), 0);
                    const diferenciaReproceso = Math.max(0, materialReprocesado - materialSalidaReproceso);
                    const materialNoConforme = materialBriqueta + diferenciaReproceso;
                    const materialNoReprocesado = activeLotePaletas.filter(p => p.estatus === 'Sin reprocesar' || p.estatus === 'En proceso' || p.estatus === 'Aceptado Con desviacion' || p.estatus === 'Liberado Directo').reduce((acc, p) => acc + (p.camadas_sueltas > 0 ? (p.camadas_sueltas * getCansPerCamada()) : getCansPerPallet(activeLote.formato)), 0);
                    const volumenTotalLatas = activeLotePaletas.reduce((acc, p) => acc + (p.camadas_sueltas > 0 ? (p.camadas_sueltas * getCansPerCamada()) : getCansPerPallet(activeLote.formato)), 0);

                    return (
                    <div className="space-y-4 text-xs">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                          <span className="text-slate-400 block font-bold uppercase text-[9px] tracking-wider">Lote de Envase</span>
                          <span className="font-mono font-bold text-slate-800 text-sm mt-0.5 block">{activeLote.lote}</span>
                        </div>
                        <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                          <span className="text-slate-400 block font-bold uppercase text-[9px] tracking-wider">Orden de Fabricación</span>
                          <span className="font-mono font-bold text-slate-800 text-sm mt-0.5 block">{activeLote.orden}</span>
                        </div>
                        <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                          <span className="text-slate-400 block font-bold uppercase text-[9px] tracking-wider">Presentación</span>
                          <span className="font-bold text-slate-800 text-sm mt-0.5 block">{activeLote.formato}</span>
                        </div>
                        <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                          <span className="text-slate-400 block font-bold uppercase text-[9px] tracking-wider">Volumen total latas</span>
                          <span className="font-bold text-slate-800 text-sm mt-0.5 block">{volumenTotalLatas.toLocaleString()} latas</span>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div className="bg-blue-50/50 p-3 rounded-xl border border-blue-100">
                          <span className="text-blue-600 block font-bold uppercase text-[9px] tracking-wider">Material Reprocesado</span>
                          <span className="font-bold text-blue-800 text-sm mt-0.5 block">{materialReprocesado.toLocaleString()} latas</span>
                        </div>
                        <div className="bg-amber-50/50 p-3 rounded-xl border border-amber-100">
                          <span className="text-amber-600 block font-bold uppercase text-[9px] tracking-wider">Material No Reprocesado</span>
                          <span className="font-bold text-amber-800 text-sm mt-0.5 block">{materialNoReprocesado.toLocaleString()} latas</span>
                        </div>
                        <div className="bg-red-50/50 p-3 rounded-xl border border-red-100">
                          <span className="text-red-600 block font-bold uppercase text-[9px] tracking-wider">Material No Conforme</span>
                          <span className="font-bold text-red-800 text-sm mt-0.5 block">{materialNoConforme.toLocaleString()} latas</span>
                        </div>
                      </div>

                      <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                        <span className="text-slate-400 block font-bold uppercase text-[9px] tracking-wider mb-1">Defecto Inicial Reportado</span>
                        <span className="font-bold text-slate-700 leading-relaxed block">{activeLote.defecto_general}</span>
                      </div>
                      <div className="flex gap-4 text-[11px] text-slate-400">
                        <span>Creado el: <strong>{new Date(activeLote.creado_el).toLocaleDateString()}</strong></span>
                        <span>Registrado por: <strong>{activeLote.usuario_registro}</strong></span>
                      </div>
                    </div>
                  )})()
                  }
                  {/* TAB 2: PALETAS RETENIDAS */}
                  {pboTabActive === 'paletas' && (
                    <form onSubmit={handleUpdatePaletas} className="space-y-4">
                      {currentRole === 'calidad' && activeLote.estatus_general !== 'Cerrado' && (
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50 border border-slate-200/60 p-3.5 rounded-xl">
                          <div className="text-xs text-slate-600 font-medium">
                            Administre las paletas de este expediente. Puede añadir nuevos tickets físicos o eliminar existentes si es necesario.
                          </div>
                          <button
                            type="button"
                            onClick={() => handleAddPaleta(activeLote.id_pbo, activeLote.defecto_general)}
                            className="flex items-center justify-center gap-1.5 bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold px-3.5 py-2 rounded-xl transition-all cursor-pointer shadow-xs shrink-0"
                          >
                            <Plus className="w-4 h-4" /> Añadir Paleta
                          </button>
                        </div>
                      )}
                      
                      <div className="overflow-x-auto rounded-xl border border-slate-200">
                        <table className="w-full text-left border-collapse min-w-[500px]">
                          <thead>
                            <tr className="bg-slate-50 text-slate-500 text-[10px] font-bold uppercase border-b border-slate-200">
                              <th className="py-2.5 px-3">Ticket Físico</th>
                              <th className="py-2.5 px-3">Paleta</th>
                              <th className="py-2.5 px-3">Camadas</th>
                              <th className="py-2.5 px-3">NCA</th>
                              <th className="py-2.5 px-3">Defecto específico</th>
                              <th className="py-2.5 px-3">Estatus</th>
                              {currentRole === 'calidad' && activeLote.estatus_general !== 'Cerrado' && (
                                <th className="py-2.5 px-3 text-center">Eliminar</th>
                              )}
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100 text-xs">
                            {activeLotePaletas.map((p, idx) => (
                              <tr key={p.id}>
                                <td className="py-1 px-1.5">
                                  <input
                                    type="text"
                                    value={p.nro_ticket}
                                    onChange={(e) => {
                                      const updated = [...paletas];
                                      const pi = updated.findIndex(item => item.id === p.id);
                                      if (pi !== -1) {
                                        updated[pi].nro_ticket = e.target.value;
                                        setPaletas(updated);
                                      }
                                    }}
                                    disabled={currentRole !== 'calidad' || activeLote.estatus_general === 'Cerrado'}
                                    className="bg-slate-50 border border-slate-200 text-xs p-1 rounded-md font-mono w-28 disabled:opacity-75"
                                  />
                                </td>
                                <td className="py-2 px-3">
                                  <span className={`text-xs font-black uppercase tracking-wider ${p.camadas_sueltas === 0 ? 'text-emerald-600' : 'text-amber-600'}`}>
                                    {p.camadas_sueltas === 0 ? 'Completa ✅' : 'Incompleta ⚠️'}
                                  </span>
                                </td>
                                <td className="py-1 px-1.5">
                                  <input
                                    type="number"
                                    value={p.camadas_sueltas}
                                    onChange={(e) => {
                                      const updated = [...paletas];
                                      const pi = updated.findIndex(item => item.id === p.id);
                                      if (pi !== -1) {
                                        updated[pi].camadas_sueltas = parseInt(e.target.value) || 0;
                                        setPaletas(updated);
                                      }
                                    }}
                                    disabled={currentRole !== 'calidad' || activeLote.estatus_general === 'Cerrado'}
                                    className="bg-slate-50 border border-slate-200 text-xs p-1 rounded-md w-16 disabled:opacity-75"
                                  />
                                </td>
                                <td className="py-1 px-1.5">
                                  <input
                                    type="text"
                                    value={p.nca}
                                    onChange={(e) => {
                                      const updated = [...paletas];
                                      const pi = updated.findIndex(item => item.id === p.id);
                                      if (pi !== -1) {
                                        updated[pi].nca = e.target.value;
                                        setPaletas(updated);
                                      }
                                    }}
                                    disabled={currentRole !== 'calidad' || activeLote.estatus_general === 'Cerrado'}
                                    className="bg-slate-50 border border-slate-200 text-xs p-1 rounded-md w-16 disabled:opacity-75"
                                  />
                                </td>
                                <td className="py-1 px-1.5">
                                  <input
                                    type="text"
                                    value={p.defecto}
                                    onChange={(e) => {
                                      const updated = [...paletas];
                                      const pi = updated.findIndex(item => item.id === p.id);
                                      if (pi !== -1) {
                                        updated[pi].defecto = e.target.value;
                                        setPaletas(updated);
                                      }
                                    }}
                                    disabled={currentRole !== 'calidad' || activeLote.estatus_general === 'Cerrado'}
                                    className="bg-slate-50 border border-slate-200 text-xs p-1 rounded-md w-full min-w-[120px] disabled:opacity-75"
                                  />
                                </td>
                                <td className="py-2 px-3">
                                  <select
                                    value={p.estatus}
                                    onChange={(e) => handlePaletaStatusChange(p, e.target.value)}
                                    disabled={currentRole !== 'calidad' || activeLote.estatus_general === 'Cerrado'}
                                    className="bg-slate-50 border border-slate-200 text-xs p-1 rounded-md disabled:opacity-75 font-semibold text-slate-700"
                                  >
                                    <option value="Sin reprocesar">🔴 Sin reprocesar</option>
                                    <option value="Briqueta">🧱 Briqueta</option>
                                    <option value="Aceptado Con desviacion">⚠️ Aceptado con Desviación</option>
                                    <option value="Reprocesado">🔄 Reprocesado</option>
                                  </select>
                                </td>
                                {currentRole === 'calidad' && activeLote.estatus_general !== 'Cerrado' && (
                                  <td className="py-2 px-3 text-center">
                                    <button
                                      type="button"
                                      onClick={() => handleRemovePaleta(p.id, p.nro_ticket)}
                                      className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all cursor-pointer"
                                      title="Eliminar Paleta"
                                    >
                                      <Trash2 className="w-4 h-4" />
                                    </button>
                                  </td>
                                )}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                      
                      {currentRole === 'calidad' && activeLote.estatus_general !== 'Cerrado' && (
                        <div className="flex justify-end">
                          <button
                            type="submit"
                            className="bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs px-4 py-2 rounded-xl transition-all cursor-pointer"
                          >
                            Actualizar Datos Quirúrgicos
                          </button>
                        </div>
                      )}
                    </form>
                  )}

                  {/* TAB 3: REPROCESO / REWORK */}
                  {pboTabActive === 'reproceso' && (
                    <div className="space-y-6">
                      
                      {/* Section: Pending original tickets with status 'Sin reprocesar' */}
                      <div className="bg-slate-50 border border-slate-200/60 rounded-2xl p-5 space-y-4">
                        <div>
                          <h3 className="text-xs font-black text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
                            Tickets Pendientes de Reprocesar (Sin Reprocesar)
                          </h3>
                          <p className="text-[11px] text-slate-500 mt-1">
                            Seleccione uno o varios tickets haciendo clic sobre ellos para agregarlos al formulario de reproceso. Al guardarse cambiarán su estatus automáticamente y se descontarán.
                          </p>
                        </div>

                        {activeLotePaletas.filter(p => p.estatus === 'Sin reprocesar').length === 0 ? (
                          <div className="bg-emerald-50 border border-emerald-100 text-emerald-800 rounded-xl p-4 text-center text-xs font-bold flex items-center justify-center gap-2">
                            <span>🎉 ¡Excelente! No quedan tickets 'Sin reprocesar' pendientes de reubicar o reprocesar en este lote.</span>
                          </div>
                        ) : (
                          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5">
                            {activeLotePaletas.filter(p => p.estatus === 'Sin reprocesar').map(p => {
                              const isChecked = selectedOriginalTickets.includes(p.nro_ticket);
                              return (
                                <div
                                  key={p.id}
                                  onClick={() => {
                                    if (currentRole !== 'calidad') return;
                                    let updatedTickets = [...selectedOriginalTickets];
                                    if (isChecked) {
                                      updatedTickets = updatedTickets.filter(t => t !== p.nro_ticket);
                                    } else {
                                      updatedTickets.push(p.nro_ticket);
                                    }
                                    setSelectedOriginalTickets(updatedTickets);
                                    setReproForm(prev => ({
                                      ...prev,
                                      tickets_originales_consumidos: updatedTickets.join(', ')
                                    }));
                                  }}
                                  className={`p-3 rounded-xl border-2 cursor-pointer transition-all text-xs flex flex-col justify-between ${
                                    isChecked
                                      ? 'border-indigo-600 bg-indigo-50/40 text-indigo-900 shadow-xs'
                                      : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
                                  } ${currentRole !== 'calidad' ? 'pointer-events-none opacity-80' : ''}`}
                                >
                                  <div className="flex items-center justify-between">
                                    <span className="font-mono font-black">{p.nro_ticket}</span>
                                    <input
                                      type="checkbox"
                                      checked={isChecked}
                                      onChange={() => {}} // handled by div click
                                      disabled={currentRole !== 'calidad'}
                                      className="rounded text-indigo-600 focus:ring-indigo-500 h-3.5 w-3.5 pointer-events-none"
                                    />
                                  </div>
                                  <div className="mt-2 text-[10px] text-slate-500 leading-tight">
                                    <div className="font-semibold text-slate-600">{p.defecto || 'Sin defecto espec.'}</div>
                                    <div className="mt-0.5 font-mono text-indigo-600">NCA: {p.nca}</div>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>

                      {/* Add Reprocess Form */}
                      {currentRole === 'calidad' && activeLote.estatus_general !== 'Cerrado' && (
                        <form onSubmit={handleAddReproceso} className="bg-orange-50/15 border border-orange-100 p-5 rounded-2xl space-y-4">
                          <h4 className="text-xs font-extrabold text-orange-700 uppercase tracking-widest flex items-center gap-1.5 border-b border-orange-100 pb-2">
                            <RefreshCw className="w-4 h-4" /> Registrar Nuevo Reproceso de Unidad
                          </h4>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                              <label className="text-[10px] font-extrabold text-slate-500 uppercase block mb-1">
                                Paletas Completas
                              </label>
                              <input
                                type="number"
                                min="0"
                                value={reproForm.paletas_nuevas}
                                onChange={(e) => {
                                  const val = Math.max(0, parseInt(e.target.value) || 0);
                                  setReproForm(prev => ({ ...prev, paletas_nuevas: val }));
                                }}
                                className="w-full bg-white border border-slate-200 rounded-lg text-xs p-2 focus:outline-hidden text-slate-800 font-bold"
                              />
                            </div>

                            <div>
                              <label className="text-[10px] font-extrabold text-slate-500 uppercase block mb-1">
                                Camadas Sueltas
                              </label>
                              <input
                                type="number"
                                min="0"
                                value={reproForm.camadas_sueltas}
                                onChange={(e) => {
                                  const val = Math.max(0, parseInt(e.target.value) || 0);
                                  setReproForm(prev => ({ ...prev, camadas_sueltas: val }));
                                }}
                                className="w-full bg-white border border-slate-200 rounded-lg text-xs p-2 focus:outline-hidden text-slate-800 font-bold"
                              />
                            </div>

                            <div className="sm:col-span-2">
                              <label className="text-[10px] font-extrabold text-slate-500 uppercase block mb-1">
                                Tickets de las Unidades Reprocesadas (separe por espacios, comas o saltos de línea) - {reproForm.nuevo_ticket_reprocesado.split(/[\s,;\n]+/).filter(t => t.trim().length > 0).length} detectados
                              </label>
                              <textarea
                                placeholder="Ej: TKT-1234, TKT-5678, TKT-9012"
                                rows={2}
                                value={reproForm.nuevo_ticket_reprocesado}
                                onChange={(e) => {
                                  const val = e.target.value;
                                  const count = val.split(/[\s,;\n]+/).filter(t => t.trim().length > 0).length;
                                  setReproForm(prev => ({ 
                                    ...prev, 
                                    nuevo_ticket_reprocesado: val,
                                    cantidad_unidades: count > 0 ? count : prev.cantidad_unidades 
                                  }));
                                }}
                                className="w-full bg-white border border-slate-200 rounded-lg text-xs p-2 focus:outline-hidden text-slate-800 font-mono font-bold"
                              />
                            </div>
                          </div>
                          
                          <div className="flex justify-end pt-2">
                            <button
                              type="submit"
                              className="bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs px-4 py-2 rounded-xl transition-all cursor-pointer shadow-xs"
                            >
                              Registrar Reproceso ({reproForm.nuevo_ticket_reprocesado.split(/[\s,;\n]+/).filter(t => t.trim().length > 0).length || 1} items)
                            </button>
                          </div>
                        </form>
                      )}

                      {/* Reprocess list: Historial */}
                      <div className="space-y-3">
                        <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Material reprocesado</h3>
                        {activeLoteRepros.length === 0 ? (
                          <div className="text-slate-400 text-xs font-semibold py-4 text-center bg-slate-50 rounded-xl border border-slate-100">
                            Ningún lote ha ingresado a reprocesamiento secundario aún.
                          </div>
                        ) : (
                          <div className="overflow-x-auto rounded-lg border border-slate-200">
                            <table className="w-full text-left border-collapse text-xs">
                              <thead>
                                <tr className="bg-slate-50 text-slate-600 font-bold uppercase border-b border-slate-200">
                                  <th className="py-2.5 px-3">Tickets Generados</th>
                                  <th className="py-2.5 px-3 text-center">Paletas</th>
                                  <th className="py-2.5 px-3 text-center">Camadas</th>
                                  <th className="py-2.5 px-3 text-right">Acciones</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-slate-100 text-slate-700">
                                {activeLoteRepros.map(r => {
                                  const isEditing = editingRepro?.id === r.id;
                                  if (isEditing && editingRepro) {
                                    return (
                                      <tr key={r.id} className="bg-orange-50/20">
                                        <td className="py-2 px-3">
                                          <input
                                            type="text"
                                            value={editingRepro.nuevo_ticket_reprocesado}
                                            onChange={(e) => setEditingRepro({ ...editingRepro, nuevo_ticket_reprocesado: e.target.value.toUpperCase() })}
                                            className="w-full bg-white border border-slate-200 rounded p-1 font-mono text-xs font-bold"
                                          />
                                        </td>
                                        <td className="py-2 px-3 text-center">
                                          <input
                                            type="number"
                                            min="0"
                                            value={editingRepro.paletas_nuevas ?? 0}
                                            onChange={(e) => setEditingRepro({ ...editingRepro, paletas_nuevas: parseInt(e.target.value) || 0 })}
                                            className="w-16 bg-white border border-slate-200 rounded p-1 text-center text-xs font-semibold"
                                          />
                                        </td>
                                        <td className="py-2 px-3 text-center">
                                          <input
                                            type="number"
                                            min="0"
                                            value={editingRepro.camadas_sueltas}
                                            onChange={(e) => setEditingRepro({ ...editingRepro, camadas_sueltas: parseInt(e.target.value) || 0 })}
                                            className="w-16 bg-white border border-slate-200 rounded p-1 text-center text-xs font-semibold"
                                          />
                                        </td>
                                        <td className="py-2 px-3 text-right">
                                          <div className="flex justify-end gap-1.5">
                                            <button
                                              onClick={handleSaveEditedRepro}
                                              className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[10px] px-2.5 py-1.5 rounded-lg transition-all cursor-pointer"
                                            >
                                              Guardar
                                            </button>
                                            <button
                                              onClick={() => setEditingRepro(null)}
                                              className="bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold text-[10px] px-2.5 py-1.5 rounded-lg transition-all cursor-pointer"
                                            >
                                              Cancelar
                                            </button>
                                          </div>
                                        </td>
                                      </tr>
                                    );
                                  }

                                  return (
                                    <tr key={r.id} className="hover:bg-slate-50/50">
                                      <td className="py-2 px-3 font-mono font-bold text-indigo-700">{r.nuevo_ticket_reprocesado}</td>
                                      <td className="py-2 px-3 text-center font-semibold">{r.paletas_nuevas ?? 0}</td>
                                      <td className="py-2 px-3 text-center font-semibold">{r.camadas_sueltas || '0'}</td>
                                      <td className="py-2 px-3 text-right">
                                        {currentRole === 'calidad' && (
                                          <div className="flex justify-end gap-1.5">
                                            <button
                                              onClick={() => setEditingRepro({ ...r })}
                                              className="text-indigo-600 hover:text-indigo-850 font-bold text-[10px] bg-indigo-50 hover:bg-indigo-100 px-2 py-1 rounded transition-all cursor-pointer"
                                            >
                                              Editar
                                            </button>
                                            <button
                                              onClick={() => handleDeleteReproceso(r)}
                                              className="text-red-600 hover:text-red-850 font-bold text-[10px] bg-red-50 hover:bg-red-100 px-2 py-1 rounded transition-all cursor-pointer"
                                            >
                                              Eliminar
                                            </button>
                                          </div>
                                        )}
                                      </td>
                                    </tr>
                                  );
                                })}
                              </tbody>
                            </table>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* TAB 5: CAUSAS Y MEDIDAS */}
                  {pboTabActive === 'causas' && (
                    <form onSubmit={handleSaveCauses} className="space-y-4 text-xs">
                      <div className="space-y-4">
                        <div>
                          <label className="text-[10px] font-extrabold text-slate-500 uppercase block mb-1">Análisis de causa raíz técnico</label>
                          <textarea
                            value={causesState.causas}
                            onChange={(e) => setCausesState(prev => ({ ...prev, causas: e.target.value }))}
                            disabled={currentRole !== 'calidad' || activeLote.estatus_general === 'Cerrado'}
                            placeholder="Describa la investigación técnica de por qué se generó la desviación de calidad..."
                            className="w-full bg-slate-50 border border-slate-200 rounded-lg text-xs p-3 h-24 focus:outline-hidden disabled:opacity-75 focus:ring-1 focus:ring-orange-500 font-semibold"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] font-extrabold text-slate-500 uppercase block mb-1">Medidas correctivas aplicadas en planta</label>
                          <textarea
                            value={causesState.medidas_correctivas}
                            onChange={(e) => setCausesState(prev => ({ ...prev, medidas_correctivas: e.target.value }))}
                            disabled={currentRole !== 'calidad' || activeLote.estatus_general === 'Cerrado'}
                            placeholder="Describa los ajustes en maquinaria o metodologías que se adoptaron para solucionar el evento..."
                            className="w-full bg-slate-50 border border-slate-200 rounded-lg text-xs p-3 h-24 focus:outline-hidden disabled:opacity-75 focus:ring-1 focus:ring-orange-500 font-semibold"
                          />
                        </div>
                      </div>

                      {currentRole === 'calidad' && activeLote.estatus_general !== 'Cerrado' && (
                        <div className="flex justify-end pt-2">
                          <button
                            type="submit"
                            className="bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs px-4 py-2.5 rounded-xl transition-all cursor-pointer"
                          >
                            Guardar Investigación Técnica
                          </button>
                        </div>
                      )}
                    </form>
                  )}

                  {/* TAB 6: LOGISTICS & WAREHOUSE */}
                  {pboTabActive === 'traslado' && (
                    <div className="space-y-6">
                      
                      {/* 1. WAREHOUSE stock relocation */}
                      <div className="bg-slate-50 border border-slate-200/60 p-4 rounded-xl text-xs">
                        <span className="text-slate-400 block font-bold uppercase text-[9px] tracking-wider mb-2">Traslado y reubicación física de inventario</span>
                        <p className="text-slate-500 mb-3 leading-relaxed">
                          La mercancía ingresa por defecto en el <strong>Almacen de PBO</strong>. Puede ser movilizada por Logística o Calidad a almacenes intermedios conforme progresa el reproceso.
                        </p>
                        <div className="flex flex-wrap gap-2">
                          <button
                            onClick={() => activeLote.estatus_general !== 'Cerrado' && handleMoveUbicacion('Almacen de PBO')}
                            disabled={activeLote.estatus_general === 'Cerrado'}
                            className={`flex-1 py-2 px-3 font-bold text-xs rounded-xl border transition-all disabled:opacity-50 ${
                              activeLote.estatus_general === 'Cerrado' ? 'cursor-not-allowed' : 'cursor-pointer'
                            } ${
                              activeLote.ubicacion === 'Almacen de PBO'
                                ? 'bg-orange-600 text-white border-orange-600'
                                : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-100'
                            }`}
                          >
                            🚚 Almacén PBO (Retención)
                          </button>
                          <button
                            onClick={() => activeLote.estatus_general !== 'Cerrado' && handleMoveUbicacion('Transicion')}
                            disabled={activeLote.estatus_general === 'Cerrado'}
                            className={`flex-1 py-2 px-3 font-bold text-xs rounded-xl border transition-all disabled:opacity-50 ${
                              activeLote.estatus_general === 'Cerrado' ? 'cursor-not-allowed' : 'cursor-pointer'
                            } ${
                              activeLote.ubicacion === 'Transicion'
                                ? 'bg-orange-600 text-white border-orange-600'
                                : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-100'
                            }`}
                          >
                            🔄 En Transición (Rework)
                          </button>
                          <button
                            onClick={() => activeLote.estatus_general !== 'Cerrado' && handleMoveUbicacion('Almacen de PT')}
                            disabled={activeLote.estatus_general === 'Cerrado'}
                            className={`flex-1 py-2 px-3 font-bold text-xs rounded-xl border transition-all disabled:opacity-50 ${
                              activeLote.estatus_general === 'Cerrado' ? 'cursor-not-allowed' : 'cursor-pointer'
                            } ${
                              activeLote.ubicacion === 'Almacen de PT'
                                ? 'bg-orange-600 text-white border-orange-600'
                                : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-100'
                            }`}
                          >
                            🏭 Almacén Producto Terminado (PT)
                          </button>
                        </div>
                      </div>

                      {/* 2. PHYSICAL AUDIT VALIDATION */}
                      <div className="space-y-3">
                        <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                          <FileCheck className="w-4 h-4 text-orange-600" /> Auditoría de Tickets Físicos de Reproceso
                        </h4>
                        <p className="text-[11px] text-slate-400">
                          Logística confirma la existencia física y consistencia del palet en el rack antes de habilitar el despacho de tickets reprocesados.
                        </p>

                        {activeLoteRepros.length === 0 ? (
                          <div className="text-slate-400 text-xs font-semibold py-4 text-center bg-slate-50 rounded-xl border border-slate-100">
                            No hay tickets generados post-reproceso para auditar en este expediente.
                          </div>
                        ) : (
                          <div className="space-y-2">
                            {activeLoteRepros.map(r => (
                              <div key={r.id} className="bg-slate-50 border border-slate-200/60 p-3.5 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                                <div>
                                  <span className="font-mono font-bold text-slate-800 text-sm block">{r.nuevo_ticket_reprocesado}</span>
                                  <span className="text-[10px] text-slate-400 mt-0.5 block">NCA: {activeLote.defecto_general.substring(0, 30)}...</span>
                                </div>

                                <div className="flex items-center gap-2">
                                  <span className={`px-2 py-0.5 rounded-sm text-[9px] font-bold uppercase mr-2 ${
                                    r.estatus_logistica === 'Confirmado' 
                                      ? 'bg-emerald-100 text-emerald-800' 
                                      : r.estatus_logistica === 'Inconsistencia' 
                                        ? 'bg-red-100 text-red-800' 
                                        : 'bg-slate-200 text-slate-600'
                                  }`}>
                                    {r.estatus_logistica}
                                  </span>

                                  {currentRole !== 'public' && activeLote.estatus_general !== 'Cerrado' && (
                                    <>
                                      <button
                                        onClick={() => handleLogisticsValidateTicket(r.id, 'Confirmado')}
                                        className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[10px] px-2.5 py-1.5 rounded-lg transition-all cursor-pointer"
                                      >
                                        Concordado
                                      </button>
                                      <button
                                        onClick={() => handleLogisticsValidateTicket(r.id, 'Inconsistencia')}
                                        className="bg-rose-600 hover:bg-rose-700 text-white font-bold text-[10px] px-2.5 py-1.5 rounded-lg transition-all cursor-pointer"
                                      >
                                        Inconsistencia
                                      </button>
                                    </>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                    </div>
                  )}

                </div>
              );
            })()
          )}
        </div>

      </div>

      {/* 5. NEW PBO DIALOG MODAL */}
      {showNewLoteModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full max-h-[95vh] sm:max-h-[90vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden">
            <div className="flex items-center justify-between border-b border-slate-100 p-5 pb-3 flex-shrink-0">
              <h3 className="text-sm sm:text-base font-extrabold text-slate-800 flex items-center gap-1.5">
                🔬 Ingreso de Producto Bajo Observación
              </h3>
              <button
                onClick={() => setShowNewLoteModal(false)}
                className="text-slate-400 hover:text-slate-700 text-sm font-bold cursor-pointer p-1"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateLote} className="flex-1 overflow-y-auto p-5 pt-0 space-y-4 text-xs pb-5">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                <div className="relative">
                  <label className="text-[10px] font-extrabold text-slate-500 uppercase block mb-1">Código del Producto (SKU)</label>
                  <div className="flex gap-1.5">
                    <input
                      type="text"
                      placeholder="🔍 Buscar SKU o nombre..."
                      value={skuSearchQuery}
                      onChange={(e) => {
                        setSkuSearchQuery(e.target.value);
                        setShowSkuDropdown(true);
                      }}
                      onFocus={() => setShowSkuDropdown(true)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 font-semibold text-slate-700 placeholder-slate-400 focus:outline-hidden focus:ring-1 focus:ring-orange-500"
                    />
                    {newLote.codigo_producto && (
                      <span className="bg-orange-100 text-orange-800 font-mono font-black text-xs px-3 rounded-lg flex items-center shadow-2xs border border-orange-200">
                        {newLote.codigo_producto}
                      </span>
                    )}
                  </div>

                  {showSkuDropdown && (
                    <div className="absolute left-0 right-0 z-40 mt-1 bg-white border border-slate-200 rounded-xl shadow-xl max-h-56 overflow-y-auto divide-y divide-slate-100">
                      {CATALOGO_PRODUCTOS_PBO.filter(p => {
                        const q = skuSearchQuery.toLowerCase().trim();
                        if (!q) return true;
                        return p.codigo.toLowerCase().includes(q) || p.nombre.toLowerCase().includes(q) || p.formato.toLowerCase().includes(q);
                      }).length === 0 ? (
                        <div className="p-3 text-xs text-slate-400 font-semibold text-center">
                          Ningún producto coincide con "{skuSearchQuery}"
                        </div>
                      ) : (
                        CATALOGO_PRODUCTOS_PBO.filter(p => {
                          const q = skuSearchQuery.toLowerCase().trim();
                          if (!q) return true;
                          return p.codigo.toLowerCase().includes(q) || p.nombre.toLowerCase().includes(q) || p.formato.toLowerCase().includes(q);
                        }).slice(0, 40).map(p => (
                          <div
                            key={p.codigo}
                            onClick={() => {
                              setNewLote(prev => ({
                                ...prev,
                                codigo_producto: p.codigo,
                                producto: p.nombre,
                                formato: p.formato
                              }));
                              setSkuSearchQuery(p.codigo);
                              setShowSkuDropdown(false);
                            }}
                            className="p-3 text-xs text-left hover:bg-orange-50 cursor-pointer transition-colors flex flex-col gap-0.5"
                          >
                            <div className="flex justify-between items-center">
                              <span className="font-mono font-black text-orange-700">{p.codigo}</span>
                              <span className="text-[10px] bg-slate-100 text-slate-600 font-bold px-1.5 py-0.5 rounded-sm">{p.formato}</span>
                            </div>
                            <span className="text-slate-600 font-semibold mt-0.5 leading-snug">{p.nombre}</span>
                          </div>
                        ))
                      )}
                    </div>
                  )}
                  {showSkuDropdown && (
                    <div 
                      className="fixed inset-0 z-30 bg-transparent" 
                      onClick={() => setShowSkuDropdown(false)}
                    />
                  )}
                </div>

                <div>
                  <label className="text-[10px] font-extrabold text-slate-500 uppercase block mb-1">Nombre de Producto (Auto-completado)</label>
                  <input
                    type="text"
                    readOnly
                    value={newLote.producto}
                    placeholder="Seleccione un Código de Producto"
                    className="w-full bg-slate-100 border border-slate-200 rounded-lg p-2.5 font-semibold text-slate-700"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-extrabold text-slate-500 uppercase block mb-1">Formato / Presentación (Auto-completado)</label>
                  <input
                    type="text"
                    readOnly
                    value={newLote.formato}
                    placeholder="Formato del producto"
                    className="w-full bg-slate-100 border border-slate-200 rounded-lg p-2.5 font-semibold text-slate-700"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-extrabold text-slate-500 uppercase block mb-1">Código de Lote de Envase</label>
                  <input
                    type="text"
                    placeholder="Ej: NR6J252A3"
                    value={newLote.lote}
                    onChange={(e) => setNewLote(prev => ({ ...prev, lote: e.target.value }))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 font-mono uppercase font-bold"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-extrabold text-slate-500 uppercase block mb-1">Orden de Fabricación</label>
                  <input
                    type="text"
                    placeholder="Ej: 70161139"
                    value={newLote.orden}
                    onChange={(e) => setNewLote(prev => ({ ...prev, orden: e.target.value }))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 font-mono"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-extrabold text-slate-500 uppercase block mb-1">Fecha de Producción</label>
                  <input
                    type="date"
                    value={newLote.fecha_produccion}
                    onChange={(e) => setNewLote(prev => ({ ...prev, fecha_produccion: e.target.value }))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-extrabold text-slate-500 uppercase block mb-1">Nivel de Calidad Aceptable (NCA) General</label>
                  <input
                    type="text"
                    value={newLote.nca}
                    onChange={(e) => setNewLote(prev => ({ ...prev, nca: e.target.value }))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-extrabold text-slate-500 uppercase block mb-1">Cantidad de Paletas Retenidas</label>
                  <input
                    type="number"
                    value={newLote.paletas_count}
                    onChange={(e) => setNewLote(prev => ({ ...prev, paletas_count: parseInt(e.target.value) >= 0 ? parseInt(e.target.value) : 0 }))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 font-bold"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-extrabold text-slate-500 uppercase block mb-1">Camadas sueltas (Opcional, de la última paleta)</label>
                  <input
                    type="number"
                    value={newLote.camadas_sueltas}
                    onChange={(e) => setNewLote(prev => ({ ...prev, camadas_sueltas: parseInt(e.target.value) || 0 }))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5"
                  />
                </div>

              </div>

              <div>
                <label className="text-[10px] font-extrabold text-slate-500 uppercase block mb-1">Defecto Técnico General</label>
                <textarea
                  placeholder="Ej: Decoración defectuosa / Desprendimiento de esmalte en tapa / Exposición metálica excesiva..."
                  value={newLote.defecto_general}
                  onChange={(e) => setNewLote(prev => ({ ...prev, defecto_general: e.target.value }))}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 h-16"
                />
              </div>

              {/* BUTTON TO GENERATE PALLET LIST */}
              <div className="flex justify-center py-1">
                <button
                  type="button"
                  onClick={handleGeneratePaletasList}
                  className="w-full flex items-center justify-center gap-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 hover:text-indigo-800 font-extrabold px-4 py-3 rounded-2xl border border-indigo-200 shadow-xs transition-all cursor-pointer text-xs"
                >
                  <Layers3 className="w-4 h-4" /> Generar Listado de Paletas para Asignación de Tickets
                </button>
              </div>

              {/* Individual Paletas Customization Table */}
              {modalPaletas.length > 0 ? (
                <div className="border border-indigo-100 rounded-2xl p-4 bg-indigo-50/30 space-y-3">
                  <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                    <span className="text-[11px] font-black text-indigo-800 uppercase tracking-wider block">
                      Asignación Detallada de Paletas ({modalPaletas.length})
                    </span>
                    <span className="text-[10px] text-slate-400 font-semibold">
                      Por defecto se hereda el NCA y defecto general
                    </span>
                  </div>
                  
                  <div className="max-h-52 overflow-y-auto space-y-2 pr-1">
                    {modalPaletas.map((mp, idx) => (
                      <div key={mp.index} className="grid grid-cols-12 gap-2 bg-white p-2.5 rounded-xl border border-slate-200 shadow-xs items-center">
                        <div className="col-span-12 sm:col-span-3 flex justify-between sm:block border-b sm:border-0 border-slate-100 pb-1 sm:pb-0">
                          <span className="text-[10px] font-bold text-slate-400 uppercase leading-tight">Paleta</span>
                          <span className="text-xs font-black text-slate-800 block">
                            #{mp.index} {mp.camadas_sueltas > 0 ? '(Sueltas)' : ''}
                          </span>
                        </div>
                        
                        <div className="col-span-6 sm:col-span-3">
                          <label className="text-[9px] font-bold text-slate-400 uppercase block mb-0.5 leading-tight sm:hidden">Nro Ticket</label>
                          <input
                            type="text"
                            value={mp.nro_ticket}
                            placeholder="TKT-#####"
                            onChange={(e) => {
                              const val = e.target.value;
                              setModalPaletas(prev => prev.map(p => p.index === mp.index ? { ...p, nro_ticket: val } : p));
                            }}
                            className="w-full bg-slate-50 border border-slate-200 rounded-md p-1 px-1.5 font-mono font-bold text-[11px] uppercase focus:bg-white focus:ring-1 focus:ring-indigo-500 focus:outline-hidden"
                          />
                        </div>

                        <div className="col-span-6 sm:col-span-2">
                          <label className="text-[9px] font-bold text-slate-400 uppercase block mb-0.5 leading-tight sm:hidden">NCA</label>
                          <input
                            type="text"
                            value={mp.nca}
                            onChange={(e) => {
                              const val = e.target.value;
                              setModalPaletas(prev => prev.map(p => p.index === mp.index ? { ...p, nca: val } : p));
                            }}
                            className="w-full bg-slate-50 border border-slate-200 rounded-md p-1 px-1.5 font-bold text-[11px] focus:bg-white"
                          />
                        </div>

                        <div className="col-span-12 sm:col-span-4">
                          <label className="text-[9px] font-bold text-slate-400 uppercase block mb-0.5 leading-tight sm:hidden">Defecto Paleta</label>
                          <input
                            type="text"
                            value={mp.defecto}
                            onChange={(e) => {
                              const val = e.target.value;
                              setModalPaletas(prev => prev.map(p => p.index === mp.index ? { ...p, defecto: val } : p));
                            }}
                            className="w-full bg-slate-50 border border-slate-200 rounded-md p-1 px-1.5 text-[11px] focus:bg-white"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="border border-dashed border-slate-300 rounded-2xl p-6 text-center text-slate-400 bg-slate-50">
                  <span className="block text-xs font-semibold mb-1">El listado de paletas no ha sido generado aún.</span>
                  <span className="block text-[10px] text-slate-400">Complete los datos superiores y haga clic en "Generar Listado de Paletas".</span>
                </div>
              )}

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowNewLoteModal(false)}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold px-4 py-2.5 rounded-xl transition-all cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="bg-orange-600 hover:bg-orange-700 text-white font-bold px-5 py-2.5 rounded-xl transition-all cursor-pointer"
                >
                  Ingresar a Base de Datos
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* 6. DELETE CONFIRMATION MODAL */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center gap-3 text-red-600">
              <span className="p-3 bg-red-50 rounded-2xl font-bold">⚠️</span>
              <div>
                <h3 className="font-bold text-slate-900 text-sm">Advertencia Crítica</h3>
                <p className="text-[10px] uppercase font-black tracking-wider text-red-500">Acción Irreversible</p>
              </div>
            </div>
            
            <p className="text-xs text-slate-600 leading-relaxed">
              ¿Está completamente seguro de eliminar el expediente <strong className="font-mono text-slate-800">{deleteConfirmId}</strong>? Esta acción eliminará permanentemente todas las paletas registradas, tickets generados y reprocesos asociados de la base de datos. No se podrá recuperar.
            </p>

            <div className="flex justify-end gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setDeleteConfirmId(null)}
                className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs px-4 py-2.5 rounded-xl transition-all cursor-pointer"
              >
                No, cancelar
              </button>
              <button
                type="button"
                onClick={() => executeDeleteLote(deleteConfirmId)}
                className="bg-red-600 hover:bg-red-700 text-white font-bold text-xs px-4 py-2.5 rounded-xl transition-all cursor-pointer shadow-xs"
              >
                Sí, eliminar expediente
              </button>
            </div>
          </div>
        </div>
      )}

      {/* HIDDEN CANVAS FOR EXPORTS */}
      <canvas ref={canvasRef} style={{ display: 'none' }} />

    </div>
  );
}
