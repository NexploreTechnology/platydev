alter table "metadata"."table_config" drop constraint "table_config_pkey";
alter table "metadata"."table_config"
    add constraint "table_config_pkey" 
    primary key ( "table_id" );
