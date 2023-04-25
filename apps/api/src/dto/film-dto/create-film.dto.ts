import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateFilmDto {
  @ApiProperty({ example: 'Титаник', description: 'name RU' })
  @IsNotEmpty()
  readonly name_ru: string;

  @ApiProperty({ example: 'Titanic', description: 'name EN', required: false })
  @IsString({ message: 'name_en: should be string' })
  readonly name_en: string;

  @ApiProperty({
    example: 'Описание фильма, любой текст',
    description: 'any text',
  })
  @IsNotEmpty()
  @IsString({ message: 'description: should be string' })
  readonly description: string;

  @ApiProperty({ example: 2020, description: 'year realize film' })
  @IsNotEmpty()
  @IsNumber({}, { message: 'year: should be number' })
  readonly year: number;

  @ApiProperty({ example: 'США', description: 'country which made film' })
  @IsNotEmpty()
  @IsString({ message: 'country: should be string' })
  readonly country: string;

  @ApiProperty({ example: 8, description: 'rating of the film' })
  @IsNotEmpty()
  @IsNumber({}, { message: 'rating: should be number' })
  readonly rating: number;

  @ApiProperty({ example: 30000, description: 'assessments' })
  @IsNotEmpty()
  @IsNumber({}, { message: 'assessments: should be number' })
  readonly assessments: number;

  @ApiProperty({ example: 2000, description: 'reviews' })
  @IsNotEmpty()
  @IsNumber({}, { message: 'reviews: should be number' })
  readonly reviews: number;

  @ApiProperty({ example: 16, description: 'age limit' })
  @IsNotEmpty()
  @IsNumber({}, { message: 'age_limit: should be number' })
  readonly age_limit: number;

  @ApiProperty({ example: 195, description: 'duration of the film' })
  @IsNotEmpty()
  @IsNumber({}, { message: 'duration: should be number' })
  readonly duration: number;

  @ApiProperty({
    example:
      '//www.kinopoisk.ru/w2ND89408/a02a89pbFq/_FO7pMKOy9lRK740GczAj36SLOCden35RDSOuzlZx8FiPM7Hfy1m8nCEdJGYEypE8i_AStDQ7NMpqd1PFbKnJr4D-vCdxIHQBHXzL0HExt9l3nPni2A1rwApneZiBujxSg7ntVkSTtJc5TLf2wt1GKVv0kOAkOXJbemvIQT90E_QeYiCx6yf108K-zQ_0eq-aMwA0qQdcNhVQKGaJ1Pz-2Ee_LxjDm3-V-MG7-RTUyKfSMZ1gqTiqFTXnR9QxOdRxGefqNywk9Z5K8ICNfbIuHHNBfOOEGvpQl-rtw9y5-1lJPKAbBVX5lLFM8fhS2wGqkjxdIC11oB5-rc4csb3ZsZfv6r_i4bHXwvSJTb216Nq_RLmjgZ41lRNoZ4nTOXrfj_hj1IGRNlyzwHBxW94J4BR0EOTiOuWW9q6DWjN_WjjVryy3IWh_mAewyIPy_2yYts61ac-QMlBfrSzIk_z90ouy4FTCk_ZV_gI3PZvVSiKRehoj6D4q0XzszZg_vdH3XOXlvyStNl5LdsiNsvDk1HrLPKMJWvpWFWVhyBk2c9CLe2rRTR1wlnnMM79T1sSr3jjZKG2yaxp5qILVcXobe9nqanIpY_GXx_qNRnG3LlA-zD_oAVp7lF4saEdUdDjbz3EoUAmctRy-i7Y2l1tN4BKxW-BrtSrSPKIKEn8y0HeYIeg3KuW4H0V2z8KzeCPYPcb0IUGTslxdKSoHnj97V46xIJaBWPnZu4k7MJjSSmTaPZ7voXJg1jvkSt3xuhG5Weusv2_pNpbMtc7KsDsrHzzJ9WHJHnXf3-cuiJB2Ml_Oee6WBJ35l_qF9j6QkobgVnndoi6269J-qcMUfnwXf1mlp_Ct473ci3TNSrS9K1-0Q7GrxJ_-VJjlIcVRMTDRiTVn3o5RtFi7Tb8xUZcN5tIxXijt-amS9WkMWvLzlrhdKyRwLKQznY72hgR9OewcNcI9qA9c_5Sfb2aNXXl3HEf87NiKkz4RsMn_tRofyCHSNprn7bgk2fbmR9j6cRpzUu1rdeHi-NvO8I_F-HnuVTOCsiQMXfrQ3WVgC9w-dR7HdSeTgt_73DgI9rIREs6mnrhfKWx_qBS24o8YubKXuhLp73Xi7HgUi3qGh7385BS6jH8jgFU-nxShpwuRPrXaATPnH80asNc0zTnzlRyGoJwx3qHiPqdaM-bP0Hm33z8YJqIypKtwGI0xy4s4OOJQdYW7ZE5WOtTcJ2jI0_Z_EMLwoBGFU3hQsoy_cFMRBakaPRgq5Xdgm7Llgxg0NBq4HaJq-KFofxGD9ofMsXSrmXQE-qCJnPVZmunlS1Z5sRBA8yIWRZV3FDjC9rqSE8fmGr2aJu2wJdo0bw5deP5QPtxrKbxk6vEQAz_IhzQyKR_-CPckCRtz3p3iKgie__qQRjon0ARRP9P2RXhwkRKH4Zyw2i6s-ytb--3BGvn3HPLf76f6JqR-W8c8z0-zNWmd_kT7K86V-toUoq2I2DjyUMt9rlRLUDaRuo05P1waTSCSul4m5HZvnbthhRF2_NYwnmbjdOOq_J5CegIEMHQkGLRDuaoD33YY3SDoj1V589qNeacQSZz317fA-zhX3s3g0PSZYSp6pdZzrIdY_jfbOZ1qq3HiYDOXDryLw_2zatN0hjkvBJZ6HhvtJA0bObBSA7BmXAmZOVd0hzn_kBYEKZU8UGMiOeIeey2FGjJ_GPOfqKVw4SMxnEIxD0ZzvSdSNQhxJ0zbNdxTreHP07z_XIF7K58CkL0Z8gP_8pBWymsTcdph67KkG3VhQ1w4vhE50Srt96FtM5vL_4DC_bvsEfSNO-bHlzsQVaNhC99-8pNAsOdciVF2mTjFczDalQkiUvjWIW5_6JO5rkuVNPKfcJ2q7HDkbXOZSjVDxTJz65p-yTPmx1w6XV-s6ohZtLYfQPKnEcQcv9j8xXw3H9kMr9v1EmqqfeoXeipEWjP6n3HVbWR1LaL_UM_-QAL9c-MQewW1Lk_Ue1mSo2kNWPDz203zYJzDVT2dtIm4sRgVhioavdVvazitlrYph1R_c1OxFScveWpg_hyIdIBAejXjlf-MfaaL2z_aV6SmjB_wPddDsmEey9M11zkFO_6dWs4rXfST4KL_ZFe95MNT9vpUeZ7vafzi6jQZjXyLi7E3KNI3Rb2pC9Y8HhWvZwWRcTeTAztk0YLddNQyTT621x8KZ12x0-uj8OLTeu9BEnB2mrIR6SV-biK2HMi_h455O2SbdgwzZw5bP9SbJWcM07721Imy4VQD2nYUdEQ2PxKUQmZWMVJoY_8rFPrvz9I0_Rf_mC1l8CltuVTEPs8EM_jhnfEEcycGWL2aHSynR5G8P9eGMeFXjdy2H3xCcL7XHYosXHhQqSb4Ip2_YQQQ-fXZOdIu4Phs6nddjfYFz7M9bps7wnqohpVyUFQn6QzZt37ezXJsno0VNld7gnJ2mxWIq1Z-0Gftsu3W-62EmbHxkD4e4mv5pWQwXES1RQw5c-PdNEK158jd_lISqulAGLA7EQ-_4RFDWPYT8cG59RTcSmOTNJ9nZffk2zWnxJ0-f9y_EiIrNuFiuRYPvM9M9vAmE76NM-5A0zxX0yXuz9n-tp-J-68TwplwWP6Mf7dR1IhinLWSoSv3aBW_505StPRSuhQoZTajqLweg3VOjDBwr1tyCXNrQ1_zl1AqJoNRePoQg3zmEExZOZB5Rfm33d1NYFQ8lmhosO3dOWJLEDCzGnOR5qGwpST3VY93wEs6PyaZOkY3Kg4VNZ1W4u5H0zj4mQ2_4JyD0nEZ8EB8uRtWBqhas1FpqDbiXnZvzpA__1tz3m6sMq3ithaKvMMKOXwmUjqJveQD07deVykgzl__NdZP9-vfy9x41P7HcH2aFAXpFLYQZq1wI5L0Z0HVMXNWthama7XuJXBbTD0ATr0y6F85QfErDBt1nl8qLM1ctDjTwXzr1APQd99zhfa5nF1M6dX0X2Bk8CoadE',
    description: 'img url',
  })
  @IsNotEmpty()
  @IsString({ message: 'img: should be string' })
  readonly img: string;

  @ApiProperty({
    example: ['4K', 'FullHD', 'HD', '1080', '720', '5.1'],
    description: 'qualities',
  })
  @IsNotEmpty()
  readonly qualities: string[];

  @ApiProperty({
    example: [
      {
        trailer: 'https://www.kinopoisk.ru/film/535341/video/62802/',
        img: '//www.kinopoisk.ru/K143V2b32/0ef0f0TBt/y9ubgC9y8nY6GEvAL4xrq3xPoyB3jhWvq0RB4Db-I0lq_LqJelqOnzZw7VNOkeru4sKrl5d1nrArbT8C2EVoAcrexpwmf_IvbgVjpR7JAv4kI9MQb9p1v6ooMI1Sp0ctz4xXQeb6NlfHjFXL2hmi-trHwu7yALvdMnBCP91I8azPizMICy7XKjZs5iD3MEsT5HqrKIObGdv_fblUUpoWGR4Mi-W6zmqzM9gZY1IJSpI7x75Odph_yf40Z9s1_NU574erzLcas_Ia2FLUB0Q3rwh2C1wr75H7l8lx3NpaSpmaHEuV7s5iDyNYzePqmeo6V6PC0upYvyVCjAvnoTC9xZNbO4y_PrcqsqwiaNeAV4-4tr-Efz-xr5PNwRQq7rbNlmTzcf4uAs_PQF3LtoXW6mdramYGtH81KiAn03VAgYHXJ9dg5wp3corIGsCbhJ8j0HZbIEvHiZuDVeWsrmLOnZJow3WqVp7DS2xBy7al8oLjSzpSCvS_5U50o79xpFndqw-rQCemV_IynKLk_7j7-wASc1xfwxmH76XV9HYCtp068BMhvsbW4_Mg-Ysu_TKiJ5t27h6gn_mG5C8_vfzBnQ8rAzC35ote1hCmkAcwj5cgAk8AUxO9m6PRaQjC8gbdKpRv6aLOjsvPTMlLLkl2akPL9i6ebM_NnmTf151EIeHXxzf8r9pzZrpYuuTDzGcPTP672Ns_sYObkal0KnI2YdZIc3UuYibDm4AZc7KFGgaX87biqjhXXTZ4w6vxUBXVr5criMsyF54evILA_2DjJ_SOkzCjm7k3q0F9pIYmSpn2oINV_tLmL6sUpUs6RZ6W06u6zhZ0r4FCZNejwSwFhV8HpxwXfmOWuig6nMc0f1sI7lOQO9flvw-56Qx26pq1itgP_dLadvNz0H33pg2yHpPfohLieCPVpuQ_W6VEPclnLyu0o-YbGlLcsqCbBPdn1LYrKLfPjT-jkS34xhYSUebgz5FawhaXM5zhDzaB6hqT57b2IvCnhXLoc5dF0OW52weriE8-8_qmXKZw4yTv51w6t6Cj1yFnI8Ep6DYOBt0W5D-V-rYypxuAETP2hXpCqxvGfnqIOyXKlGMv2XQFTV9TW5BnDnsOVijSYO_E3z8oDn84h8Oln1-JTZA-nnYttgz3kYZ6cmOTrBX7vqk6xo-n3pIudLtZzjijx8kMCfVXHw_M65430t7cOvSDjOPTPLZfxLN_7S9XGWWEvtoiWTYU9-n-6u6LWwRpg1r93gqzy1ra0jjjhVIoi-Mt1F0Jp1e3bMsqm8LqjOakbyTbM6D-l7CHg8m3C42RWD5SErEWAPMVSrKKHzNMvWtqxeJCgyfi0oZc960G5M8TKdBZ_UePI8hrPrd6XpgWwCOQY5dkvvuoU9thBwctSRCeLqYtNtDvXcr63rPXHKHD5n0-eldryob6AP8BjmTL290oARWfz0cc7wIvehJQ2kTPrJ-jpIIvLK9DaXvrxfkYBmrKTRYI82nargLr70hdByoJ6mKrvzaqdhRLMQoYf08lWMGV7-eDkIca_3puxJ6sX8w7Z0zOu4jXDzXz743ZRBaWmj2a0Lcl3taKi_eEtW_WLdbi1_vKqgIMK-mu1GMXCbQtXW9TU0wPIgdiErgOGGcwy4OgIkt4V5udn5NJuRSWVt5ZKiiH2e4uVr9LwK0T-knG-kubhtJG9M9tQri3190AVVmHY4Psh9qf4t6cXhAXqJMPVIZbkEuf6XN7NSXAwmp2oeaQs_HuQupDP1BljzINnm6T26bCWijX_Sb4J5-NoEFFR0-L3KcWb2I6pA7si7TLE3imr3yvU_Urh0Vh5EqmGq1WUBPhZsY6I990xYtebaoaO8umLoaEJ_kuBHO7hTwBMefTX3CvtnsmzoTGPMMgw2NYpifc89u1949F0XSqysL1fvATIepidmtH8O1z2i2a-t-vouZqkEv9kgzTD7UY7TFDh_ecl3Z3qkrAbtj31MfnSCpDcOe75QPnnW2kWhZeFTqY_-lyRnr_L9BFW5o52uITH_Ji6tizoTaoQ1MtQLVlJyd_ZLe2f3JCzMLsw6SDB6QmS8hr13n7D_GpkCaevqUmhE_ZplKa--MIff9K-fau4ycG-hYc1_Uy2NMvoSQJ5fu_w-h7PlduOjyufEe0s_dEcsf4I-8JPzvdfehCcho5dmSbCQKyIvfX6NnPemX2MuP7dpKCBMMBvqzjV4WAwcFzQ5dwMwabwhLgKsSLmDOjbAZz3Ov3ZasbqdWA8sJC3bpUDzV-ev4HZ4g983qN4oo3pzaGeqDLgaZk84-dEEExF1M3HGMO70bquJZYA0DXE4Dif4gvF40Ps9ldQIpyyrX6BMsJIkJWF1NUWZPCPar-JzcOlm7Y94n-gGPTkdQJ3d_LR-g3Yg9eXsiK7NtQE5vg9icsx2-V66sBtWz2ytZppqC72V7e-stPSDEf5m1eMuM75h4GDF-FXgzPS7VImTUDn8-wYxaTDl6MYlDDqLeTIKJfEPOXCX83kfHwUpKa7aZ0j6VetmI_I9z9D84pymITW7Za0oin7Zrga-9JlLn1-7N3hJ_-n47OpC6Qo-jnawiOnyRvuzkHH53dxBZ-As0O9HNpPrqCmyvoEReWtb4OX8cOjioUn_1eBPeLqUDtnS8r28gvhvtaWihSYIM4H99w7t_Uz_Oh959JfWSeliKdKvjz2b4mZpsriDUTdoVuHs9zpgKGEPO9CqzTb41EvdV7Ezc4B-onLsoUIkjr2HuvCB7bfNtrNWvf2WVEhm4G1QLoH9lGlmrjc1xJh8LxNsLjq2JafoCnAYooP0s5UCWVHxPLdE_ue2YCqA4040hna3ye37xni2EbM4XVmI4W2kWm8Ld1MvoG4zucGZtOCU52y19m7nY48yVaGCMbuazNecu7qxSbGluChrxuXC8A_wf4kqcIw3c9vw-dMWyu1ooV9ghzKSLK3uO7pG1TNrmeCs_r3l5CHKe5VrhI',
      },
    ],
    description: 'trailers',
  })
  @IsNotEmpty()
  readonly trailers: [{ trailer: string; img: string }];

  @ApiProperty({
    example: ['русский', 'английский'],
    description: 'languages',
  })
  @IsNotEmpty()
  readonly languagesAudio: string[];

  @ApiProperty({
    example: ['русский', 'английский'],
    description: 'languages',
  })
  @IsNotEmpty()
  readonly languagesSubtitle: string[];

  @ApiProperty({
    example: [
      { genre_ru: 'драма', genre_en: 'drama', slug: 'drama' },
      { genre_ru: 'комедия', genre_en: 'comedy', slug: 'comedia' },
    ],
    description: 'genres',
  })
  @IsNotEmpty()
  readonly genres: [{ genre_ru: string; genre_en: string; slug: string }];
}
