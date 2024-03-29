PGDMP                  	    {         	   warehouse    16.0    16.0 T               0    0    ENCODING    ENCODING        SET client_encoding = 'UTF8';
                      false                       0    0 
   STDSTRINGS 
   STDSTRINGS     (   SET standard_conforming_strings = 'on';
                      false                       0    0 
   SEARCHPATH 
   SEARCHPATH     8   SELECT pg_catalog.set_config('search_path', '', false);
                      false                       1262    16806 	   warehouse    DATABASE     �   CREATE DATABASE warehouse WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE_PROVIDER = libc LOCALE = 'English_United States.1252';
    DROP DATABASE warehouse;
                postgres    false            �            1259    17449    Category    TABLE     _   CREATE TABLE public."Category" (
    id_categ bigint NOT NULL,
    categ_name text NOT NULL
);
    DROP TABLE public."Category";
       public         heap    postgres    false            �            1259    17448    Category_id_categ_seq    SEQUENCE     �   CREATE SEQUENCE public."Category_id_categ_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 .   DROP SEQUENCE public."Category_id_categ_seq";
       public          postgres    false    220                       0    0    Category_id_categ_seq    SEQUENCE OWNED BY     S   ALTER SEQUENCE public."Category_id_categ_seq" OWNED BY public."Category".id_categ;
          public          postgres    false    219            �            1259    17442    Floor    TABLE     �   CREATE TABLE public."Floor" (
    id_floor bigint NOT NULL,
    number integer NOT NULL,
    max_size integer NOT NULL,
    occup_size integer NOT NULL
);
    DROP TABLE public."Floor";
       public         heap    postgres    false            �            1259    17441    Floor_id_floor_seq    SEQUENCE     }   CREATE SEQUENCE public."Floor_id_floor_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 +   DROP SEQUENCE public."Floor_id_floor_seq";
       public          postgres    false    218                       0    0    Floor_id_floor_seq    SEQUENCE OWNED BY     M   ALTER SEQUENCE public."Floor_id_floor_seq" OWNED BY public."Floor".id_floor;
          public          postgres    false    217            �            1259    17524    Good    TABLE     �   CREATE TABLE public."Good" (
    id_good bigint NOT NULL,
    id_model bigint NOT NULL,
    id_categ bigint NOT NULL,
    storage_address bigint,
    date_of_arrival date
);
    DROP TABLE public."Good";
       public         heap    postgres    false            �            1259    17523    Good_id_good_seq    SEQUENCE     {   CREATE SEQUENCE public."Good_id_good_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 )   DROP SEQUENCE public."Good_id_good_seq";
       public          postgres    false    232                       0    0    Good_id_good_seq    SEQUENCE OWNED BY     I   ALTER SEQUENCE public."Good_id_good_seq" OWNED BY public."Good".id_good;
          public          postgres    false    231            �            1259    17546    Log    TABLE     �   CREATE TABLE public."Log" (
    id_log bigint NOT NULL,
    id_user integer NOT NULL,
    id_good integer NOT NULL,
    action text NOT NULL,
    current_address text,
    old_address text
);
    DROP TABLE public."Log";
       public         heap    postgres    false            �            1259    17545    Log_id_log_seq    SEQUENCE     y   CREATE SEQUENCE public."Log_id_log_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 '   DROP SEQUENCE public."Log_id_log_seq";
       public          postgres    false    234                       0    0    Log_id_log_seq    SEQUENCE OWNED BY     E   ALTER SEQUENCE public."Log_id_log_seq" OWNED BY public."Log".id_log;
          public          postgres    false    233            �            1259    17488    Model    TABLE     �   CREATE TABLE public."Model" (
    id_mod bigint NOT NULL,
    model_name text NOT NULL,
    description text,
    model_size integer NOT NULL
);
    DROP TABLE public."Model";
       public         heap    postgres    false            �            1259    17487    Model_id_mod_seq    SEQUENCE     {   CREATE SEQUENCE public."Model_id_mod_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 )   DROP SEQUENCE public."Model_id_mod_seq";
       public          postgres    false    228                       0    0    Model_id_mod_seq    SEQUENCE OWNED BY     I   ALTER SEQUENCE public."Model_id_mod_seq" OWNED BY public."Model".id_mod;
          public          postgres    false    227            �            1259    17435    Rack    TABLE     }   CREATE TABLE public."Rack" (
    id_rack bigint NOT NULL,
    number integer NOT NULL,
    shelfs_number integer NOT NULL
);
    DROP TABLE public."Rack";
       public         heap    postgres    false            �            1259    17434    Rack_id_rack_seq    SEQUENCE     {   CREATE SEQUENCE public."Rack_id_rack_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 )   DROP SEQUENCE public."Rack_id_rack_seq";
       public          postgres    false    216                       0    0    Rack_id_rack_seq    SEQUENCE OWNED BY     I   ALTER SEQUENCE public."Rack_id_rack_seq" OWNED BY public."Rack".id_rack;
          public          postgres    false    215            �            1259    17476    Shelf    TABLE     �   CREATE TABLE public."Shelf" (
    id_shelf bigint NOT NULL,
    id_rack integer NOT NULL,
    number integer NOT NULL,
    max_size integer NOT NULL,
    occup_size integer NOT NULL
);
    DROP TABLE public."Shelf";
       public         heap    postgres    false            �            1259    17475    Shelf_id_shelf_seq    SEQUENCE     }   CREATE SEQUENCE public."Shelf_id_shelf_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 +   DROP SEQUENCE public."Shelf_id_shelf_seq";
       public          postgres    false    226                       0    0    Shelf_id_shelf_seq    SEQUENCE OWNED BY     M   ALTER SEQUENCE public."Shelf_id_shelf_seq" OWNED BY public."Shelf".id_shelf;
          public          postgres    false    225            �            1259    17458    Size    TABLE     x   CREATE TABLE public."Size" (
    id_size bigint NOT NULL,
    amount integer NOT NULL,
    description text NOT NULL
);
    DROP TABLE public."Size";
       public         heap    postgres    false            �            1259    17457    Size_id_size_seq    SEQUENCE     {   CREATE SEQUENCE public."Size_id_size_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 )   DROP SEQUENCE public."Size_id_size_seq";
       public          postgres    false    222                       0    0    Size_id_size_seq    SEQUENCE OWNED BY     I   ALTER SEQUENCE public."Size_id_size_seq" OWNED BY public."Size".id_size;
          public          postgres    false    221            �            1259    17502    Storage    TABLE     �   CREATE TABLE public."Storage" (
    id_storage bigint NOT NULL,
    rack_id integer,
    shelf_id integer,
    floor_id integer
);
    DROP TABLE public."Storage";
       public         heap    postgres    false            �            1259    17501    Storage_id_storage_seq    SEQUENCE     �   CREATE SEQUENCE public."Storage_id_storage_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 /   DROP SEQUENCE public."Storage_id_storage_seq";
       public          postgres    false    230                        0    0    Storage_id_storage_seq    SEQUENCE OWNED BY     U   ALTER SEQUENCE public."Storage_id_storage_seq" OWNED BY public."Storage".id_storage;
          public          postgres    false    229            �            1259    17467 	   User_data    TABLE     �   CREATE TABLE public."User_data" (
    id_user bigint NOT NULL,
    login text NOT NULL,
    password text NOT NULL,
    name text NOT NULL
);
    DROP TABLE public."User_data";
       public         heap    postgres    false            �            1259    17466    User_data_id_user_seq    SEQUENCE     �   CREATE SEQUENCE public."User_data_id_user_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 .   DROP SEQUENCE public."User_data_id_user_seq";
       public          postgres    false    224            !           0    0    User_data_id_user_seq    SEQUENCE OWNED BY     S   ALTER SEQUENCE public."User_data_id_user_seq" OWNED BY public."User_data".id_user;
          public          postgres    false    223            I           2604    17452    Category id_categ    DEFAULT     z   ALTER TABLE ONLY public."Category" ALTER COLUMN id_categ SET DEFAULT nextval('public."Category_id_categ_seq"'::regclass);
 B   ALTER TABLE public."Category" ALTER COLUMN id_categ DROP DEFAULT;
       public          postgres    false    219    220    220            H           2604    17445    Floor id_floor    DEFAULT     t   ALTER TABLE ONLY public."Floor" ALTER COLUMN id_floor SET DEFAULT nextval('public."Floor_id_floor_seq"'::regclass);
 ?   ALTER TABLE public."Floor" ALTER COLUMN id_floor DROP DEFAULT;
       public          postgres    false    218    217    218            O           2604    17527    Good id_good    DEFAULT     p   ALTER TABLE ONLY public."Good" ALTER COLUMN id_good SET DEFAULT nextval('public."Good_id_good_seq"'::regclass);
 =   ALTER TABLE public."Good" ALTER COLUMN id_good DROP DEFAULT;
       public          postgres    false    232    231    232            P           2604    17549 
   Log id_log    DEFAULT     l   ALTER TABLE ONLY public."Log" ALTER COLUMN id_log SET DEFAULT nextval('public."Log_id_log_seq"'::regclass);
 ;   ALTER TABLE public."Log" ALTER COLUMN id_log DROP DEFAULT;
       public          postgres    false    233    234    234            M           2604    17491    Model id_mod    DEFAULT     p   ALTER TABLE ONLY public."Model" ALTER COLUMN id_mod SET DEFAULT nextval('public."Model_id_mod_seq"'::regclass);
 =   ALTER TABLE public."Model" ALTER COLUMN id_mod DROP DEFAULT;
       public          postgres    false    227    228    228            G           2604    17438    Rack id_rack    DEFAULT     p   ALTER TABLE ONLY public."Rack" ALTER COLUMN id_rack SET DEFAULT nextval('public."Rack_id_rack_seq"'::regclass);
 =   ALTER TABLE public."Rack" ALTER COLUMN id_rack DROP DEFAULT;
       public          postgres    false    215    216    216            L           2604    17479    Shelf id_shelf    DEFAULT     t   ALTER TABLE ONLY public."Shelf" ALTER COLUMN id_shelf SET DEFAULT nextval('public."Shelf_id_shelf_seq"'::regclass);
 ?   ALTER TABLE public."Shelf" ALTER COLUMN id_shelf DROP DEFAULT;
       public          postgres    false    225    226    226            J           2604    17461    Size id_size    DEFAULT     p   ALTER TABLE ONLY public."Size" ALTER COLUMN id_size SET DEFAULT nextval('public."Size_id_size_seq"'::regclass);
 =   ALTER TABLE public."Size" ALTER COLUMN id_size DROP DEFAULT;
       public          postgres    false    221    222    222            N           2604    17505    Storage id_storage    DEFAULT     |   ALTER TABLE ONLY public."Storage" ALTER COLUMN id_storage SET DEFAULT nextval('public."Storage_id_storage_seq"'::regclass);
 C   ALTER TABLE public."Storage" ALTER COLUMN id_storage DROP DEFAULT;
       public          postgres    false    229    230    230            K           2604    17470    User_data id_user    DEFAULT     z   ALTER TABLE ONLY public."User_data" ALTER COLUMN id_user SET DEFAULT nextval('public."User_data_id_user_seq"'::regclass);
 B   ALTER TABLE public."User_data" ALTER COLUMN id_user DROP DEFAULT;
       public          postgres    false    223    224    224                      0    17449    Category 
   TABLE DATA           :   COPY public."Category" (id_categ, categ_name) FROM stdin;
    public          postgres    false    220   u]                 0    17442    Floor 
   TABLE DATA           I   COPY public."Floor" (id_floor, number, max_size, occup_size) FROM stdin;
    public          postgres    false    218   �]                 0    17524    Good 
   TABLE DATA           _   COPY public."Good" (id_good, id_model, id_categ, storage_address, date_of_arrival) FROM stdin;
    public          postgres    false    232   �]                 0    17546    Log 
   TABLE DATA           _   COPY public."Log" (id_log, id_user, id_good, action, current_address, old_address) FROM stdin;
    public          postgres    false    234   �]                 0    17488    Model 
   TABLE DATA           N   COPY public."Model" (id_mod, model_name, description, model_size) FROM stdin;
    public          postgres    false    228   �]       �          0    17435    Rack 
   TABLE DATA           @   COPY public."Rack" (id_rack, number, shelfs_number) FROM stdin;
    public          postgres    false    216   ^       	          0    17476    Shelf 
   TABLE DATA           R   COPY public."Shelf" (id_shelf, id_rack, number, max_size, occup_size) FROM stdin;
    public          postgres    false    226   #^                 0    17458    Size 
   TABLE DATA           >   COPY public."Size" (id_size, amount, description) FROM stdin;
    public          postgres    false    222   @^                 0    17502    Storage 
   TABLE DATA           L   COPY public."Storage" (id_storage, rack_id, shelf_id, floor_id) FROM stdin;
    public          postgres    false    230   ]^                 0    17467 	   User_data 
   TABLE DATA           E   COPY public."User_data" (id_user, login, password, name) FROM stdin;
    public          postgres    false    224   z^       "           0    0    Category_id_categ_seq    SEQUENCE SET     F   SELECT pg_catalog.setval('public."Category_id_categ_seq"', 1, false);
          public          postgres    false    219            #           0    0    Floor_id_floor_seq    SEQUENCE SET     C   SELECT pg_catalog.setval('public."Floor_id_floor_seq"', 1, false);
          public          postgres    false    217            $           0    0    Good_id_good_seq    SEQUENCE SET     A   SELECT pg_catalog.setval('public."Good_id_good_seq"', 1, false);
          public          postgres    false    231            %           0    0    Log_id_log_seq    SEQUENCE SET     ?   SELECT pg_catalog.setval('public."Log_id_log_seq"', 1, false);
          public          postgres    false    233            &           0    0    Model_id_mod_seq    SEQUENCE SET     A   SELECT pg_catalog.setval('public."Model_id_mod_seq"', 1, false);
          public          postgres    false    227            '           0    0    Rack_id_rack_seq    SEQUENCE SET     A   SELECT pg_catalog.setval('public."Rack_id_rack_seq"', 1, false);
          public          postgres    false    215            (           0    0    Shelf_id_shelf_seq    SEQUENCE SET     C   SELECT pg_catalog.setval('public."Shelf_id_shelf_seq"', 1, false);
          public          postgres    false    225            )           0    0    Size_id_size_seq    SEQUENCE SET     A   SELECT pg_catalog.setval('public."Size_id_size_seq"', 1, false);
          public          postgres    false    221            *           0    0    Storage_id_storage_seq    SEQUENCE SET     G   SELECT pg_catalog.setval('public."Storage_id_storage_seq"', 1, false);
          public          postgres    false    229            +           0    0    User_data_id_user_seq    SEQUENCE SET     F   SELECT pg_catalog.setval('public."User_data_id_user_seq"', 47, true);
          public          postgres    false    223            V           2606    17456    Category Category_pkey 
   CONSTRAINT     ^   ALTER TABLE ONLY public."Category"
    ADD CONSTRAINT "Category_pkey" PRIMARY KEY (id_categ);
 D   ALTER TABLE ONLY public."Category" DROP CONSTRAINT "Category_pkey";
       public            postgres    false    220            T           2606    17447    Floor Floor_pkey 
   CONSTRAINT     X   ALTER TABLE ONLY public."Floor"
    ADD CONSTRAINT "Floor_pkey" PRIMARY KEY (id_floor);
 >   ALTER TABLE ONLY public."Floor" DROP CONSTRAINT "Floor_pkey";
       public            postgres    false    218            b           2606    17529    Good Good_pkey 
   CONSTRAINT     U   ALTER TABLE ONLY public."Good"
    ADD CONSTRAINT "Good_pkey" PRIMARY KEY (id_good);
 <   ALTER TABLE ONLY public."Good" DROP CONSTRAINT "Good_pkey";
       public            postgres    false    232            d           2606    17553    Log Log_pkey 
   CONSTRAINT     R   ALTER TABLE ONLY public."Log"
    ADD CONSTRAINT "Log_pkey" PRIMARY KEY (id_log);
 :   ALTER TABLE ONLY public."Log" DROP CONSTRAINT "Log_pkey";
       public            postgres    false    234            ^           2606    17495    Model Model_pkey 
   CONSTRAINT     V   ALTER TABLE ONLY public."Model"
    ADD CONSTRAINT "Model_pkey" PRIMARY KEY (id_mod);
 >   ALTER TABLE ONLY public."Model" DROP CONSTRAINT "Model_pkey";
       public            postgres    false    228            R           2606    17440    Rack Rack_pkey 
   CONSTRAINT     U   ALTER TABLE ONLY public."Rack"
    ADD CONSTRAINT "Rack_pkey" PRIMARY KEY (id_rack);
 <   ALTER TABLE ONLY public."Rack" DROP CONSTRAINT "Rack_pkey";
       public            postgres    false    216            \           2606    17481    Shelf Shelf_pkey 
   CONSTRAINT     X   ALTER TABLE ONLY public."Shelf"
    ADD CONSTRAINT "Shelf_pkey" PRIMARY KEY (id_shelf);
 >   ALTER TABLE ONLY public."Shelf" DROP CONSTRAINT "Shelf_pkey";
       public            postgres    false    226            X           2606    17465    Size Size_pkey 
   CONSTRAINT     U   ALTER TABLE ONLY public."Size"
    ADD CONSTRAINT "Size_pkey" PRIMARY KEY (id_size);
 <   ALTER TABLE ONLY public."Size" DROP CONSTRAINT "Size_pkey";
       public            postgres    false    222            `           2606    17507    Storage Storage_pkey 
   CONSTRAINT     ^   ALTER TABLE ONLY public."Storage"
    ADD CONSTRAINT "Storage_pkey" PRIMARY KEY (id_storage);
 B   ALTER TABLE ONLY public."Storage" DROP CONSTRAINT "Storage_pkey";
       public            postgres    false    230            Z           2606    17474    User_data User_data_pkey 
   CONSTRAINT     _   ALTER TABLE ONLY public."User_data"
    ADD CONSTRAINT "User_data_pkey" PRIMARY KEY (id_user);
 F   ALTER TABLE ONLY public."User_data" DROP CONSTRAINT "User_data_pkey";
       public            postgres    false    224            j           2606    17535    Good Good_id_categ_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public."Good"
    ADD CONSTRAINT "Good_id_categ_fkey" FOREIGN KEY (id_categ) REFERENCES public."Category"(id_categ);
 E   ALTER TABLE ONLY public."Good" DROP CONSTRAINT "Good_id_categ_fkey";
       public          postgres    false    232    220    4694            k           2606    17530    Good Good_id_model_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public."Good"
    ADD CONSTRAINT "Good_id_model_fkey" FOREIGN KEY (id_model) REFERENCES public."Model"(id_mod);
 E   ALTER TABLE ONLY public."Good" DROP CONSTRAINT "Good_id_model_fkey";
       public          postgres    false    232    228    4702            l           2606    17540    Good Good_storage_address_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public."Good"
    ADD CONSTRAINT "Good_storage_address_fkey" FOREIGN KEY (storage_address) REFERENCES public."Storage"(id_storage);
 L   ALTER TABLE ONLY public."Good" DROP CONSTRAINT "Good_storage_address_fkey";
       public          postgres    false    232    4704    230            m           2606    17559    Log Log_id_good_fkey    FK CONSTRAINT     }   ALTER TABLE ONLY public."Log"
    ADD CONSTRAINT "Log_id_good_fkey" FOREIGN KEY (id_good) REFERENCES public."Good"(id_good);
 B   ALTER TABLE ONLY public."Log" DROP CONSTRAINT "Log_id_good_fkey";
       public          postgres    false    234    232    4706            n           2606    17554    Log Log_id_user_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public."Log"
    ADD CONSTRAINT "Log_id_user_fkey" FOREIGN KEY (id_user) REFERENCES public."User_data"(id_user);
 B   ALTER TABLE ONLY public."Log" DROP CONSTRAINT "Log_id_user_fkey";
       public          postgres    false    234    224    4698            f           2606    17496    Model Model_model_size_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public."Model"
    ADD CONSTRAINT "Model_model_size_fkey" FOREIGN KEY (model_size) REFERENCES public."Size"(id_size);
 I   ALTER TABLE ONLY public."Model" DROP CONSTRAINT "Model_model_size_fkey";
       public          postgres    false    228    222    4696            e           2606    17482    Shelf Shelf_id_rack_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public."Shelf"
    ADD CONSTRAINT "Shelf_id_rack_fkey" FOREIGN KEY (id_rack) REFERENCES public."Rack"(id_rack);
 F   ALTER TABLE ONLY public."Shelf" DROP CONSTRAINT "Shelf_id_rack_fkey";
       public          postgres    false    4690    216    226            g           2606    17518    Storage Storage_floor_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public."Storage"
    ADD CONSTRAINT "Storage_floor_id_fkey" FOREIGN KEY (floor_id) REFERENCES public."Floor"(id_floor);
 K   ALTER TABLE ONLY public."Storage" DROP CONSTRAINT "Storage_floor_id_fkey";
       public          postgres    false    218    4692    230            h           2606    17508    Storage Storage_rack_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public."Storage"
    ADD CONSTRAINT "Storage_rack_id_fkey" FOREIGN KEY (rack_id) REFERENCES public."Rack"(id_rack);
 J   ALTER TABLE ONLY public."Storage" DROP CONSTRAINT "Storage_rack_id_fkey";
       public          postgres    false    216    230    4690            i           2606    17513    Storage Storage_shelf_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public."Storage"
    ADD CONSTRAINT "Storage_shelf_id_fkey" FOREIGN KEY (shelf_id) REFERENCES public."Shelf"(id_shelf);
 K   ALTER TABLE ONLY public."Storage" DROP CONSTRAINT "Storage_shelf_id_fkey";
       public          postgres    false    4700    226    230                  x������ � �            x������ � �            x������ � �            x������ � �            x������ � �      �      x������ � �      	      x������ � �            x������ � �            x������ � �         �   x�-�=�P��}��&�sn`aeC�b�Xha@���?�Zhe�4� *^aލ�6���of��	g���0"l���J!�A�Hg�V+>�!�In2op�pU'��6���TT5k���"�IPp-W���6xr�6�CoO��5\��r7�,t���Me,K}u�����s{Fr6�.L.�����?�~�D     