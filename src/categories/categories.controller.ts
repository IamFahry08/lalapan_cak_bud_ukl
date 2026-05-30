import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { Role } from '@prisma/client';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('categories')
@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  // POST /categories → admin only
  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Buat (admin) - Buat kategori baru' })
  @ApiResponse({ status: 201, description: 'Kategori berhasil dibuat' })
  @ApiResponse({ status: 403, description: 'Forbidden - Bukan admin' })
  create(@Body() createCategoryDto: CreateCategoryDto) {
    return this.categoriesService.create(createCategoryDto);
  }

  // GET /categories → public
  @Get()
  @ApiOperation({ summary: 'Check Public - Tampilkan semua kategori' })
  @ApiResponse({ status: 200, description: 'Berhasil' })
  findAll() {
    return this.categoriesService.findAll();
  }

  // GET /categories/:id → public
  @Get(':id')
  @ApiOperation({ summary: 'Tampilkan kategori by ID' })
  findOne(@Param('id') id: string) {
    return this.categoriesService.findOne(id);
  }

  // PATCH /categories/:id → admin only
  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update (admin) - Update kategori' })
  update(
    @Param('id') id: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ) {
    return this.categoriesService.update(id, updateCategoryDto);
  }

  // DELETE /categories/:id → admin only
  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Hapus (admin) - Hapus kategori' })
  remove(@Param('id') id: string) {
    return this.categoriesService.remove(id);
  }
}
