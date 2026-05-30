import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { MenuItemsService } from './menu-items.service';
import { CreateMenuItemDto } from './dto/create-menu-item.dto';
import { UpdateMenuItemDto } from './dto/update-menu-item.dto';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { Role } from '@prisma/client';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';

@ApiTags('menu-items')
@Controller('menu-items')
export class MenuItemsController {
  constructor(private readonly menuItemsService: MenuItemsService) {}

  @Post()
  @UseGuards()
  @Roles(Role.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create-Menu (admin) - Tambah menu baru' })
  @ApiResponse({ status: 201, description: 'Menu berhasil ditambahkan' })
  create(@Body() dto: CreateMenuItemDto) {
    return this.menuItemsService.create(dto);
  }

  @Get('grouped')
  @ApiOperation({ summary: 'Tampilkan group - Menu dikelompokkan per kategori' })
  findAllGrouped() {
    return this.menuItemsService.findAllGrouped();
  }

  @Get()
  @ApiOperation({ summary: 'Tampilkan semua menu' })
  @ApiQuery({
    name: 'categoryId',
    required: false,
    description: 'Filter by kategori',
  })
  findAll(@Query('categoryId') categoryId?: string) {
    return this.menuItemsService.findAll(categoryId);
  }

  // GET /menu-items/:id → public
  @Get(':id')
  @ApiOperation({ summary: 'Tampilkan ? id category - Tampilkan menu by ID' })
  findOne(@Param('id') id: string) {
    return this.menuItemsService.findOne(id);
  }

  // PATCH /menu-items/:id → admin only
  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update (admin) - Update menu' })
  update(
    @Param('id') id: string,
    @Body() updateMenuItemDto: UpdateMenuItemDto,
  ) {
    return this.menuItemsService.update(id, updateMenuItemDto);
  }

  // DELETE /menu-items/:id → admin only
  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete (admin) - Hapus menu' })
  remove(@Param('id') id: string) {
    return this.menuItemsService.remove(id);
  }
}
